from datetime import datetime
from flask_login import UserMixin

# Note: We're not using SQLAlchemy models since we're using BigQuery for storage
# This model is mainly for user session management with Flask-Login
class User(UserMixin):
    def __init__(self, uid, email, display_name=None):
        self.id = uid  # Firebase UID
        self.email = email
        self.display_name = display_name
        self.created_at = datetime.utcnow()
        self.last_seen = datetime.utcnow()
        
    @property
    def is_authenticated(self):
        return True
        
    @property
    def is_active(self):
        return True
        
    @property
    def is_anonymous(self):
        return False
        
    def get_id(self):
        return str(self.id)
        
    def __repr__(self):
        return f'<User {self.email}>'

# Message structure for reference (stored in BigQuery)
"""
Message Schema in BigQuery:
- user_id: STRING
- message: STRING
- timestamp: TIMESTAMP
- email: STRING
"""
