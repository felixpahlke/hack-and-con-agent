from fastapi import APIRouter

from app.agent.langgraph import run_graph

router = APIRouter()


@router.get("/")
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
