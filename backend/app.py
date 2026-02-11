import firebase_admin
from firebase_admin import credentials, db
from flask import Flask, jsonify, request
from flask_cors import CORS
import bcrypt
from Logic.game_engine import process_day, BASE_STATS

# 1. Initialize Firebase (Maintain your key)
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://studio-5051566130-a3c45-default-rtdb.firebaseio.com/'
})

app = Flask(__name__)
CORS(app)

# 2. Reference Tables based on your new Architecture Plan
db_ref = db.reference('/')

# --- AUTH HELPERS ---
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# --- ROUTES ---
@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        user_id = data['email'].replace('.', '_')
        
        # Security: Industry-standard hashing using bcrypt
        hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # 1. Auth Table: Critical User Credentials
        db_ref.child('users').child(user_id).set({
            "full_name": data.get('full_name', 'Player One'),
            "email": data['email'],
            "password_hash": hashed
        })
        
        # 2. Progress Table: The 'Single Source of Truth'
        db_ref.child('user_progress').child(user_id).set({
            "stats": BASE_STATS,
            "xp": {
                "level": 1,
                "total_xp": 0,
                "xp_for_next_level": 100
            },
            "completed_tasks_today_count": 0
        })
        
        # 3. Profile Table: Avatar & Display Info
        db_ref.child('profiles').child(user_id).set({
            "has_setup_profile": False
        })
        
        return jsonify({"status": "success", "message": "All game systems initialized!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        user_id = data['email'].replace('.', '_')
        
        # Fetch the user from the Auth Table
        user = db_ref.child('users').child(user_id).get()
        
        if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({
                "status": "success", 
                "message": "Login successful", 
                "user_id": user_id
            })
        
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    
@app.route('/api/google-auth', methods=['POST'])
def google_auth():
    try:
        data = request.json
        user_id = data['email'].replace('.', '_')
        
        # Check if the user already exists to avoid overwriting progress
        user_exists = db_ref.child('users').child(user_id).get()
        
        if not user_exists:
            # 1. Auth Table: Link Google account
            db_ref.child('users').child(user_id).set({
                "full_name": data.get('name', 'New Player'),
                "email": data['email'],
                "auth_provider": "google"
            })
            # 2. Progress Table: Seed initial game stats
            db_ref.child('user_progress').child(user_id).set({
                "stats": BASE_STATS,
                "xp": {"level": 1, "total_xp": 0, "xp_for_next_level": 100},
                "completed_tasks_today_count": 0
            })
            # 3. Profile Table: Mark profile as needing setup
            db_ref.child('profiles').child(user_id).set({"has_setup_profile": False})
            
        return jsonify({"status": "success", "user_id": user_id})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    
if __name__ == "__main__":
    app.run(debug=True)
