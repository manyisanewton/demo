import logging
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from . import db
from .models import UserRole, Role
logger = logging.getLogger(__name__)
def allowed_file(filename):
      ALLOWED_EXTENSIONS = {'jpeg', 'jpg', 'png', 'pdf', 'mp4'}
      return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
def roles_required(*required_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                user_id = int(get_jwt_identity())
                rows = (
                    db.session
                    .query(Role.name)
                    .join(UserRole, Role.id == UserRole.role_id)
                    .filter(UserRole.user_id == user_id)
                    .all()
                )
                user_roles = {name for (name,) in rows}
                if not user_roles.intersection(required_roles):
                    return jsonify(error="Forbidden: insufficient role"), 403
            except Exception:
                logger.exception("Error verifying roles for user_id=%s", user_id)
                return jsonify(error="Unable to verify roles"), 500
            return fn(*args, **kwargs)
        return wrapper
    return decorator