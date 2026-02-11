import firebase_admin
from firebase_admin import credentials, db
from Logic.game_engine import BASE_STATS

# 1. Initialize
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://studio-5051566130-a3c45-default-rtdb.firebaseio.com/'
})

# 2. Reference player_1
player_ref = db.reference('users/player_1')

# 3. Create initial RPG state
initial_state = {
    "stats": BASE_STATS,
    "xp": {
        "level": 1,
        "total_xp": 0,
        "xp_for_next_level": 100,
        "xp_progress_in_level": 0
    },
    "character": {
        "character_state": "normal",
        "theme": "normal"
    },
    "quests": {
        "active": [],
        "completed": []
    }
}

# 4. Push to Cloud
player_ref.set(initial_state)
print("✅ Database Seeded! Player 1 is ready for adventure.")