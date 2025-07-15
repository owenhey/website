from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import wordgame

app = Flask(__name__)
CORS(app)

highscores = []
cluedle_counts = {}




def saveData():
    print("saving data")
    with open("highscores.txt", "w") as f:
        json.dump(highscores, f)

def saveCluedleData():
    with open("cluedle_counts.txt", "w") as f:
        json.dump(cluedle_counts, f)
 
def loadInData():
    global highscores
    print("loading in data")
    if os.path.exists("highscores.txt"):
        with open("highscores.txt", "r") as f:
            highscores = json.load(f)
            print("Loaded in the data: " + json.dumps(highscores))

def loadCluedleData():
    global cluedle_counts
    if os.path.exists("cluedle_counts.txt"):
        with open("cluedle_counts.txt", "r") as f:
            cluedle_counts = json.load(f)

def cleanupOldWords():
    global cluedle_counts
    if len(cluedle_counts) > 3:
        # Keep the 3 most recently added words (last 3 items)
        recent_words = list(cluedle_counts.items())[-3:]
        cluedle_counts = dict(recent_words)
        saveCluedleData()

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

@app.route('/cluedle_count', methods=['POST'])
def cluedle_count():
    word = request.args.get('word', 'NOWORD')
    
    if word == 'NOWORD':
        return jsonify({"status": "error", "message": "No word provided"})
    
    global cluedle_counts
    
    if word in cluedle_counts:
        cluedle_counts[word] += 1
    else:
        cluedle_counts[word] = 1
    
    cleanupOldWords()
    saveCluedleData()
    
    return jsonify({"status": "success", "count": cluedle_counts[word]})

@app.route('/get_cluedle_count', methods=['POST'])
def get_cluedle_count():
    word = request.args.get('word', 'NOWORD')
    
    if word == 'NOWORD':
        return jsonify({"status": "error", "message": "No word provided"})
    
    global cluedle_counts
    count = cluedle_counts.get(word, 0)
    
    return jsonify({"count": count})

@app.route('/word-game', methods=['GET'])
def word_game():
    json_data = request.get_json()

    ret = wordgame.handleGet(json_data)
    print("Got my ret back: " + str(ret))

    return jsonify({"data": ret})

if __name__ == '__main__':
    wordgame.init()
    loadInData()
    loadCluedleData()
    app.run(debug=True)