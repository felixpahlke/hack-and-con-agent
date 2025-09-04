from fastapi import APIRouter

from app.agent.langflow import run_langflow
from app.agent.langgraph import run_graph

router = APIRouter()


@router.get("/langgraph")
async def start_agent():
    messages = [
        {
            "role": "user",
            "content": "Hello, how are you?",
        }
    ]

    response = run_graph(messages)

    print("RESULT", response)
    return {"message": response}


@router.get("/langflow")
async def start_agent_langflow():
    response = run_langflow()
    return {"message": response}
