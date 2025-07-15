import json

class GameData:
    def __init__(self, code):
       self.code = code
       self.users = []

    def addUser(self, name):
        team = "RED" if len(self.users) % 2 == 0 else "BLUE"
        self.users.append((name, team))
        return team

    def getUsers(self):
        return self.users

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

    retData["Type"] = "TEAM"
    retData["Data"] = currentGames[code].addUser(name)
    currentGames[code].printState()

def requestUsers(code):
    global currentGames
    global retData

    retData["Type"] = "SEND_USERS"
    if(code not in currentGames):
        retData["Data"] = []
    else:
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
    if(dataType == "REQUEST_USERS"):
        requestUsers(data["Code"])


    return retData