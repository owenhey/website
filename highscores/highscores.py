from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

highscores = []

def saveData():
    print("saving data")
    with open("highscores.txt", "w") as f:
        json.dump(highscores, f)
 
def loadInData():
    global highscores
    print("loading in data")
    if os.path.exists("highscores.txt"):
        with open("highscores.txt", "r") as f:
            highscores = json.load(f)
            print("Loaded in the data: " + json.dumps(highscores))

@app.route('/', methods=['GET'])
def hello():
    return "Working Website! 2"

@app.route('/receive', methods=['POST'])
def receive_data():
    print("Received data")
    name = request.args.get('name', 'NONAME')
    mode = request.args.get('mode', 'NOMODE')
    region = request.args.get('region', 'NOREGION')
    time_ms = int(request.args.get('time_ms', 'NOTIME'))
    
    isNewHighscore = handleNewTime(name, mode, region, time_ms)
    
    return jsonify({"status": "success", "highscore": str(isNewHighscore)})

@app.route('/send', methods=['GET'])
def send_data():
    global highscores
    print(f"Got send request!")
    if(len(highscores) == 0):
        print("highscores length is 0")
        return jsonify({"message": ''})
    return jsonify({"message": json.dumps(highscores)})

def handleNewTime(name, mode, region, time):
    global highscores
    if(name == 'NONAME'):
        return
    if(mode == 'NOMODE'):
        return
    if(region == 'NOREGION'):
        return
    if(time == 'NOTIME'):
        return

    newHighscore = False
    
    for entry in highscores:
        if entry["mode"] == mode and entry["region"] == region:
            if time < entry["time"]:
                entry["name"] = name
                entry["time"] = time
                newHighscore = True
            break
    else:
        highscores.append({"mode": mode, "region": region, "name": name, "time": time})
        newHighscore = True

    if newHighscore:
        saveData()
        return True
    else:
        return False

if __name__ == '__main__':
    loadInData()
    app.run(debug=True)