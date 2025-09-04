import uuid
from datetime import datetime

from fastapi import APIRouter, BackgroundTasks, HTTPException
from sqlmodel import SQLModel

from app.agent.langflow import run_langflow
from app.agent.langgraph import run_graph
from app.api.deps import SessionDep
from app.tables import AgentRun

router = APIRouter()


class AgentRunResponse(SQLModel):
    run_id: uuid.UUID


class Step(SQLModel):
    id: uuid.UUID
    type: str
    text: str
    status: str
    created_at: datetime


class AgentStatusResponse(SQLModel):
    steps: list[Step]
    status: str
    status_message: str
    draft_body: str
    draft_subject: str


@router.get("/langgraph", response_model=AgentRunResponse)
async def start_agent(
    session: SessionDep,
    background_tasks: BackgroundTasks,
    subject: str,
    body: str,
    sender: str,
):
    mail = f"Subject: {subject}\nBody: {body}\nSender: {sender}"

    # Create new agent run record
    agent_run = AgentRun(
        mail_sender=sender,
        mail_subject=subject,
        mail_body=body,
        status="running",
        status_message="Agent processing started",
        draft_body="",
        draft_subject="",
    )
    session.add(agent_run)
    session.commit()
    session.refresh(agent_run)

    background_tasks.add_task(run_graph, mail, session, agent_run.id)

    return AgentRunResponse(run_id=agent_run.id)


@router.get("/langflow", response_model=AgentRunResponse)
async def start_agent_langflow():
    response = run_langflow()
    return AgentRunResponse(message=response)


@router.get("/{run_id}", response_model=AgentStatusResponse)
async def get_agent_run(session: SessionDep, run_id: uuid.UUID):
    agent_run = session.get(AgentRun, run_id)
    if not agent_run:
        raise HTTPException(status_code=404, detail="Agent run not found")

    return AgentStatusResponse(
        steps=agent_run.steps,
        status=agent_run.status,
        status_message=agent_run.status_message,
        draft_body=agent_run.draft_body,
        draft_subject=agent_run.draft_subject,
    )
