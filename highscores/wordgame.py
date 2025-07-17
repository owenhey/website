import json

class GameData:
    def __init__(self, code):
       self.code = code
       self.users = []
       self.answers = []

    def addUser(self, name):
        team = "RED" if len(self.users) % 2 == 0 else "BLUE"
        self.users.append((name, team))
        return team

    def getUsers(self):
        return self.users

    def addAnswer(self, name, roundNumber, answer):
        self.answers.append((name, roundNumber, answer))

    def getAnswers(self, roundNumber):
        return [x for x in self.answers if x[1] == roundNumber]

    def printState(self):
        print(self.code)
        print(self.users)
    

currentGames = {}
retData = {}

def init():
    print("hello my name is owen does this print?")

def handleNewUser(code, name):
    global currentGames
    global retData

    if(code not in currentGames):
        currentGames[code] = GameData(code)
        print("Creating new game! " + code)

    retData["Type"] = "TEAM"
    retData["Data"] = currentGames[code].addUser(name)
    currentGames[code].printState()

def handleSendAnswer(code, name, roundIndex, answer):
    global currentGames
    global retData

    if(code not in currentGames):
        retData["Type"] = "INVALID"
        retData["Data"] = "Game not created"
        return
    
    retData["Type"] = "GOT_ANSWER"
    currentGames[code].addAnswer(name, roundIndex, answer)

def handleGetAnswers(code, roundIndex):
    global currentGames
    global retData

    if(code not in currentGames):
        retData["Type"] = "INVALID"
        retData["Data"] = "Game not created"
        return
    retData["Type"] = "ANSWERS"
    answersInRound = currentGames[code].getAnswers(roundIndex)
    answersDict = [{'Name': n, 'Round': r, 'Answer': a} for n, r, a in answersInRound]

    answers_wrapper = {"answers": answersDict}
    retData["Data"] = json.dumps(answers_wrapper)
    

def requestUsers(code):
    global currentGames
    global retData

    retData["Type"] = "SEND_USERS"
    if(code not in currentGames):
        retData["Type"] = "INVALID"
        retData["Data"] = "Game not created"
        return
        
    userList = currentGames[code].getUsers()
    dict_list = [{'Name': k, 'Team': v} for k, v in userList]

    users_wrapper = {"users": dict_list}
    retData["Data"] = json.dumps(users_wrapper)

def handleGet(data):
    global currentGames
    global retData

    print(data)

    retData = {}
    retData["Code"] = data["Code"]

    dataType = data["Type"]
    if(dataType == "MAKE_USER"):
        handleNewUser(data["Code"], data["Data"])
    elif(dataType == "REQUEST_USERS"):
        requestUsers(data["Code"])
    elif(dataType == "SEND_ANSWER"):
        handleSendAnswer(data["Code"], data["Data"], data["Metadata1"], data["Metadata2"])
    elif(dataType == "GET_ANSWERS"):
        handleGetAnswers(data["Code"], data["Data"])


    return retData