import subprocess
from flask_cors import CORS
from flask import Flask, jsonify

# Create a Flask app.
app = Flask(__name__)

# Enable CORS for all routes.
CORS(app)

# Declare the process global variable.
process = None


@app.route('/start', methods=['POST'])
def start_script():
    global process

    if process is None:
        process = subprocess.Popen(['python', 'query_data.py'])
        return jsonify({'status': 'Script started'})

    return jsonify({'status': 'Script is already running'})


@app.route('/stop', methods=['POST'])
def stop_script():
    global process

    if process is not None:
        process.terminate()
        process = None
        return jsonify({'status': 'Script stopped'})

    return jsonify({'status': 'No script running'})


if __name__ == '__main__':
    # Run the Flask app on port 5004 to enable API calls (the port can be modified).
    app.run(port=5004)
