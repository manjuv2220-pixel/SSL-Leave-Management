import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'textile-leave-management-secret-key-2024'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Leave policies
    ANNUAL_LEAVE_DAYS = 18
    SICK_LEAVE_DAYS = 12
    CASUAL_LEAVE_DAYS = 8

    # Company info
    COMPANY_NAME = "Textile Innovations Ltd."
    COMPANY_EMAIL = "hr@textileinnovations.com"

    # File upload settings
    UPLOAD_FOLDER = 'static/uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

    # Session settings
    PERMANENT_SESSION_LIFETIME = timedelta(days=1)