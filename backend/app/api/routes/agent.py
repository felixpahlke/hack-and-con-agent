from fastapi import APIRouter
from sqlmodel import SQLModel

from app.agent.langflow import run_langflow
from app.agent.langgraph import run_graph
from app.api.deps import SessionDep

router = APIRouter()


class AgentRun(SQLModel):
    message: str


@router.get("/langgraph", response_model=AgentRun)
async def start_agent(session: SessionDep, subject: str, body: str, sender: str):
    mail = f"Subject: {subject}\nBody: {body}\nSender: {sender}"

    response = run_graph(mail)

    print("RESULT", response)
    return AgentRun(message=response)


@router.get("/langflow", response_model=AgentRun)
async def start_agent_langflow():
    response = run_langflow()
    return AgentRun(message=response)
