from flask import Flask, jsonify
from flask_cors import CORS
from mock_data import MOCK_CHARACTER_STATE

app = Flask(__name__)
CORS(app) # Allows Shradha's frontend to talk to this backend

@app.route('/api/character', methods=['GET'])
def get_character_status():
    try:
        # In the future, this is where your Firebase code goes
        # For now, we simulate a successful database hit
        return jsonify({"status": "success", "data": MOCK_CHARACTER_STATE})
    
    except Exception as e:
        # STABILITY FEATURE: If anything fails, send the Mock Data!
        print(f"Error detected: {e}")
        return jsonify({
            "status": "fallback", 
            "message": "Database offline, serving local backup.",
            "data": MOCK_CHARACTER_STATE
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

def generate_quests(stats):
    # STABILITY FEATURE: Clamp stats between 0 and 100 
    # This prevents 'Visual Glitches' if the database sends out-of-bounds numbers.
    energy = max(0, min(100, stats.get('energy', 100)))
    health = max(0, min(100, stats.get('health', 100)))
    focus = max(0, min(100, stats.get('focus', 100)))
    
    quests = []
    
    # Use these 'clamped' variables for your logic to ensure consistency
    if energy < 30:
        quests.append({"id": "q1", "task": "20-minute Power Nap", "type": "corrective"})
    
    if health < 50:
        quests.append({"id": "q2", "task": "Drink 500ml Water", "type": "corrective"})

    if focus > 80:
        quests.append({"id": "q3", "task": "1-hour Deep Work Sprint", "type": "boss_challenge"})

    if not quests:
        quests.append({"id": "q4", "task": "Log one positive habit", "type": "daily"})
        
    return quests