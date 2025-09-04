import uuid
from datetime import datetime
from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


# Database model, database table inferred from class name
class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


class Item(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


class AgentRun(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    mail_sender: str = Field()
    mail_subject: str = Field()
    mail_body: str = Field()
    status: str = Field()
    status_message: str = Field()
    draft_body: str = Field()
    draft_subject: str = Field()
    steps: list["Step"] = Relationship(back_populates="agent_run", cascade_delete=True)


class Step(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    type: str = Field()
    text: str = Field()
    status: str = Field()
    created_at: datetime = Field(default_factory=datetime.now)
    agent_run_id: uuid.UUID = Field(
        foreign_key="agentrun.id", nullable=False, ondelete="CASCADE"
    )
    agent_run: AgentRun | None = Relationship(back_populates="steps")
