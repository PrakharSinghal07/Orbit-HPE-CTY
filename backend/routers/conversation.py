from fastapi import APIRouter
from models.schemas import NewConversation, ConvPatch
import uuid
router = APIRouter(prefix="/conversation", tags=["Chatbot"])

conversationsArr = [{
    "sessionId": str(uuid.uuid4()),
    "title": "New Chat",
    "messages": []
}]


@router.get("/initial")
def getInitialConversation():
    if len(conversationsArr) == 0:
        return {
            "sessionId": str(uuid.uuid4()),
            "title": "New Chat",
            "messages": []
        }
    else:
        return conversationsArr[0]


@router.post("/create")
def createNewConversation(newConversation: NewConversation):
    global conversationsArr
    obj = {
        "sessionId": str(uuid.uuid4()),
        "title": newConversation.title,
        "messages": newConversation.messages
    }
    if len(conversationsArr) == 0:
        conversationsArr = [obj]
    else:
        conversationsArr.insert(0, obj)
    print(conversationsArr)
    return obj


@router.get('/sidebar')
def getSidebarDetails():
    titleArr = []
    for convo in conversationsArr:
        titleArr.append({
            "title": convo["title"],
            "sessionId": convo["sessionId"]
        })
    return titleArr


@router.delete("/{currentSessionID}")
def delete_conversation(currentSessionID):
    global conversationsArr
    for index, conversation in enumerate(conversationsArr):
        if conversation["sessionId"] == currentSessionID:
            conversationsArr.pop(index)
            if (len(conversationsArr) == 0):
                conversationsArr = [{
                    "sessionId": str(uuid.uuid4()),
                    "title": "New Chat",
                    "messages": []
                }]
            return conversation


@router.post("/{currentSessionID}")
def save_conversation(convo: ConvPatch, currentSessionID):
    global conversationsArr
    for index, convoo in enumerate(conversationsArr):
        if convoo["sessionId"] == currentSessionID:

            conversationsArr[index]["messages"].append(convo.userMsg)
            conversationsArr[index]["messages"].append(convo.botMsg)
            if conversationsArr[index]["title"] == "New Chat":
                conversationsArr[index]["title"] = convo.prompt
            return convoo


@router.get("/active/{currentSessionID}")
def getActiveConversation(currentSessionID):
    global conversationsArr
    global conversationsObj
    print(currentSessionID)
    print(conversationsArr)
    for conversation in conversationsArr:
        if conversation["sessionId"] == currentSessionID:
            conversationsObj = conversation
            return conversation
    print("HELLO")
