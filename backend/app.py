import os
from flask import Flask, request, jsonify, Response, stream_with_context, send_from_directory
from flask_cors import CORS
from google.cloud import bigquery
import firebase_admin
from firebase_admin import credentials, auth
import json
import logging
from datetime import datetime
from google import genai
from google.genai import types
from generate import generate
from bqlibs import executeQuery, insertMessage, deleteMessage

#temp
logging.basicConfig(level=logging.DEBUG)

# Set Google Cloud credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'firebase-credentials.json'

app = Flask(__name__, static_folder='static/dist', static_url_path='/') # 本番用
# app = Flask(__name__, static_folder='../frontend/static/dist', static_url_path='/') # ローカル用
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://*.repl.co"]}})

# Initialize Firebase Admin
cred = credentials.Certificate('firebase-credentials.json')
firebase_admin.initialize_app(cred)

# Initialize BigQuery client
client = bigquery.Client()


# Serve React App - catch all routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')


def verify_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        logging.error(f"Token verification error: {str(e)}")
        return None


@app.route('/api/talktovertex', methods=['POST'])
def talktovertex():
    logging.info("talktovertex function called")
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401

    token = auth_header.split('Bearer ')[1]
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'error': 'Invalid token'}), 401
    user_id = user_data.get('user_id')
    
    data = request.get_json()
    messages = data.get('messages', [])
    print("messages: ", messages)

    if not messages:
        return jsonify({'error': 'Message is required'}), 400

    try:
        vertex_response = generate(messages)
        logging.info(f"response from vertex ai: {vertex_response}")
        
        if vertex_response:
            insert_error = insertMessage(client, user_id, False, vertex_response)
            
            if insert_error:
                logging.error(f"BigQuery insertion error: {str(insert_error)}")
                return jsonify({'error': 'Failed to save message'}), 500
        
        return jsonify({'response': vertex_response}), 200
    except Exception as e:
        logging.error(f"Vertex AI error: {str(e)}")
        return jsonify({'error': 'Failed to process message with Vertex AI'}), 500


def send_mailaddress_to_profile(user_data):
    # send_mailaddress_to_profile関数が呼ばれたことをログに出力
    logging.info("send_mailaddress_to_profile function called")

    # まだ未登録であればbigqueryにメールアドレスとユーザーID（firebaseのuid）を追加
    try:
        user_id = user_data.get('user_id')
        email = user_data.get('email')
        query = f"""
        INSERT INTO `project-id.dataset.table` (mail, user_id)
            VALUES ('{email}', '{user_id}')
        """
        results = executeQuery(client, query)
    except Exception as e:
        logging.error(f"BigQuery query error: {str(e)}")
        return jsonify({'error': 'Failed to fetch profile'}), 500

@app.route('/api/profile', methods=['GET'])
def get_profile():
    print("プロフィール取得開始")
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401

    token = auth_header.split('Bearer ')[1]
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'error': 'Invalid token'}), 401

    email = user_data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    user_id = user_data.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    print("email: ", email)
    print("user_id: ", user_id)

    query = f"""
        SELECT *
        FROM `project-id.dataset.table`
        WHERE mail = '{email}'
        LIMIT 1
    """

    try:
        results = executeQuery(client, query)
        profile = None
        for row in results:
            profile = {
                'user_id': row.user_id,
                'mail': row.mail,
                'nick_name': row.nick_name,
                'era': row.era,
                'sex': row.sex,
                'coach_type': row.coach_type,
                'language': row.language
            }
        
        print("profile: ", profile)

        if profile:
            return jsonify(profile), 200
        else:
            # データがない場合は、メールアドレスとuser_idをbigqueryに追加
            send_mailaddress_to_profile(user_data)
            
    except Exception as e:
        logging.error(f"BigQuery query error: {str(e)}")
        return jsonify({'error': 'Failed to fetch profile'}), 500

@app.route('/api/messages', methods=['POST'])
def send_message():
    # send_message関数が呼ばれたことをログに出力
    logging.info("send_message function called")

    # ログインしているか確認
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    
    # reactから送信されたtokenを取得
    token = auth_header.split('Bearer ')[1]
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'error': 'Invalid token'}), 401
    
    # ユーザーIDとメッセージを取得
    user_id = user_data.get('user_id')
    data = request.json
    message = data.get('message')

    if not message:
        return jsonify({'error': 'Message is required'}), 400

    errors = insertMessage(client, user_id, True, message)
    
    if errors:
        logging.error(f"BigQuery insertion error: {str(errors)}")
        return jsonify({'error': 'Failed to save message'}), 500
    
    return jsonify({'status': 'success'})

@app.route('/api/messages', methods=['GET'])
def get_messages():
    print("メッセージ取得開始")
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401

    token = auth_header.split('Bearer ')[1]
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'error': 'Invalid token'}), 401
    
    user_id = user_data.get('user_id')

    query = f"""
        SELECT *
        FROM `coaching-ai-9f9c2.conversations.t_conversation`
        WHERE user_id = '{user_id}'
        ORDER BY timestamp ASC
        LIMIT 100
    """

    try:
        results = executeQuery(client, query)
        
        if(results == None):
            print("No messages found")
            return jsonify({'error': 'No messages found'}), 404

        messages = []
        for row in results:
            message = {
                'timestamp': row.timestamp.isoformat(),
                'user_id': row.user_id,
                'goal_id': row.goal_id,
                'speaker': row.speaker,
                'describe': row.describe
            }
            if message['speaker'] == 'summary':
                messages = []
            if message['speaker'] == 'delete':
                messages = []
                continue
            messages.append(message)
        print("messages: ", messages)
        return jsonify(messages)
    except Exception as e:
        logging.error(f"BigQuery query error: {str(e)}")
        return jsonify({'error': 'Failed to fetch messages'}), 500
    
@app.route('/api/messages', methods=['DELETE'])
def delete_messages():
    logging.info("delete_messages function called")
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401

    token = auth_header.split('Bearer ')[1]
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'error': 'Invalid token'}), 401
    
    user_id = user_data.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    errors = deleteMessage(client, user_id)
    
    if errors:
        logging.error(f"BigQuery insertion error: {str(errors)}")
        return jsonify({'error': 'Failed to delete messages'}), 500

    return jsonify({'status': 'success'})

@app.route('/api/messages/stream')
def stream_messages():
    token = request.args.get('token')
    if not token:
        return jsonify({'error': 'Unauthorized'}), 401

    user_data = verify_token(token) # ここでverify_tokenを呼び出す
    if not user_data:
            return jsonify({'error': 'Invalid token'}), 401

    def generate():
        query = """
            SELECT user_id, message, timestamp, email
            FROM `coaching-ai-9f9c2.conversations.t_conversation`
            WHERE timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 SECOND)
            ORDER BY timestamp DESC
        """

        while True:
            try:
                query_job = client.query(query)
                results = query_job.result()

                for row in results:
                    message = {
                        'user_id': row.user_id,
                        'message': row.message,
                        'timestamp': row.timestamp.isoformat(),
                        'email': row.email
                    }
                    yield f"data: {json.dumps(message)}\n\n"
            except Exception as e:
                logging.error(f"Stream query error: {str(e)}")
                yield f"data: {json.dumps({'error': 'Query failed'})}\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream'
    )