import logging
from datetime import datetime

logging.basicConfig(level=logging.DEBUG)

def executeQuery(client, query):
    logging.info(f"Executing query: {query}")
    query_job = client.query(query)
    results = query_job.result()
    return results
  
def insertMessage(client, user_id, isUser, message):
    table_id = 'project_id.dataset.table'
    rows_to_insert = [{
        'timestamp': datetime.now().isoformat(),
        'user_id': user_id,
        'goal_id': '1',
        'speaker': 'user' if isUser else 'model',
        'describe': message
    }]

    return client.insert_rows_json(table_id, rows_to_insert)
  
def deleteMessage(client, user_id):
    table_id = 'project_id.dataset.table'
    rows_to_insert = [{
        'timestamp': datetime.now().isoformat(),
        'user_id': user_id,
        'goal_id': '1',
        'speaker': 'delete',
        'describe': ''
    }]
    
    return client.insert_rows_json(table_id, rows_to_insert)
    