import os

class Config:
    FIREBASE_API_KEY = os.environ.get('FIREBASE_API_KEY')
    FIREBASE_PROJECT_ID = os.environ.get('FIREBASE_PROJECT_ID')
    FIREBASE_APP_ID = os.environ.get('FIREBASE_APP_ID')
    BIGQUERY_PROJECT = os.environ.get('BIGQUERY_PROJECT')
