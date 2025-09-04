import logging
import uuid
from typing import Annotated, Literal

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_ibm import ChatWatsonx
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages
from sqlmodel import Session
from typing_extensions import TypedDict

from app.services.watsonx_provider import WatsonxProvider
from app.tables import AgentRun, Step


class State(TypedDict):
    # Messages have the type "list". The `add_messages` function
    # in the annotation defines how this state key should be updated
    # (in this case, it appends messages to the list, rather than overwriting them)
    messages: Annotated[list, add_messages] = []
    next_agent: str
    expert_analysis: str
    session: Session
    agent_run_id: uuid.UUID


graph_builder = StateGraph(State)

llm = ChatWatsonx(
    model_id="meta-llama/llama-4-maverick-17b-128e-instruct-fp8",
    watsonx_client=WatsonxProvider.instance().client,
    max_tokens=100000,
)


def create_step(
    session: Session,
    agent_run_id: uuid.UUID,
    step_type: str,
    text: str,
    status: str = "completed",
):
    """Helper function to create a step in the database."""
    step = Step(type=step_type, text=text, status=status, agent_run_id=agent_run_id)
    session.add(step)
    session.commit()
    session.refresh(step)
    return step


def update_agent_run_status(
    session: Session, agent_run_id: uuid.UUID, status: str, status_message: str
):
    """Helper function to update the agent run status."""
    agent_run = session.get(AgentRun, agent_run_id)
    if agent_run:
        agent_run.status = status
        agent_run.status_message = status_message
        session.add(agent_run)
        session.commit()
        session.refresh(agent_run)


def master_agent(state: State):
    """Orchestrator agent that decides which expert agent should handle the request."""
    print("🎯 Master agent called - analyzing request to determine expert agent")

    # Create step for master agent
    create_step(
        state["session"],
        state["agent_run_id"],
        "master_agent",
        "Analyzing request to determine appropriate expert agent",
        "running",
    )

    # Update run status
    update_agent_run_status(
        state["session"],
        state["agent_run_id"],
        "running",
        "Master agent analyzing request",
    )

    system_message = SystemMessage(
        content="""Du bist ein Orchestrator-Agent für eine deutsche Krankenkasse. 
Deine Aufgabe ist es, Kundenanfragen zu analysieren und zu entscheiden, welcher Experten-Agent die Anfrage am besten bearbeiten kann.



Verfügbare Experten-Agenten:
- zuzahlung: Für Fragen zu Zuzahlungen, Eigenanteilen, Befreiungen
- familienversicherung: Für Fragen zur Familienversicherung, Mitversicherung von Angehörigen
- pflegeversicherung: Für Fragen zur Pflegeversicherung, Pflegegraden, Leistungen
- krankengeld: Für Fragen zum Krankengeld, Arbeitsunfähigkeit, Lohnfortzahlung
- kostenuebernahme: Für Kostenübernahme-Anträge, Erstattungen, Privatrechnungen
- widerspruch: Für Widersprüche gegen Ablehnungsbescheide, Rechtsmittel
- mutterschaft: Für Schwangerschaft, Mutterschaftsgeld, Vorsorgeuntersuchungen
- rehabilitation: Für Reha-Maßnahmen, Kuren, medizinische Rehabilitation
- terminvermittlung: Für Terminanfragen, Beratungstermine, Facharzttermine, Wartezeiten
- sonstiges: Für alle anderen Anfragen (Versichertenkarte, Bankdaten ändern, etc.)

Analysiere die Kundenanfrage und antworte NUR mit dem Namen des zuständigen Experten-Agenten.
Antworte nur mit einem Wort: zuzahlung, familienversicherung, pflegeversicherung, krankengeld, kostenuebernahme, widerspruch, mutterschaft, rehabilitation, terminvermittlung, sonstiges oder email_drafter."""
    )
    messages = state["messages"]
    messages_with_system = [system_message] + messages
    response = llm.invoke(messages_with_system)

    # Extract the expert agent name from the response
    expert_agent = response.content.strip().lower()

    # Validate the response and default to "sonstiges" if invalid
    valid_agents = [
        "zuzahlung",
        "familienversicherung",
        "pflegeversicherung",
        "krankengeld",
        "kostenuebernahme",
        "widerspruch",
        "mutterschaft",
        "rehabilitation",
        "terminvermittlung",
        "sonstiges",
        "email_drafter",
    ]
    if expert_agent not in valid_agents:
        print(
            f"⚠️  Invalid expert agent '{expert_agent}' returned by master agent, defaulting to 'sonstiges'"
        )
        expert_agent = "sonstiges"

    print(f"✅ Master agent decision: routing to '{expert_agent}' expert")

    # Update step status to completed
    # Get the most recent step for this agent run
    steps = (
        state["session"]
        .query(Step)
        .filter(Step.agent_run_id == state["agent_run_id"], Step.type == "master_agent")
        .order_by(Step.id.desc())
        .first()
    )
    if steps:
        steps.status = "completed"
        steps.text = f"Routed request to {expert_agent} expert agent"
        state["session"].add(steps)
        state["session"].commit()

    return {
        "next_agent": expert_agent,
    }


def zuzahlung_expert(state: State):
    """Expert agent for co-payment related inquiries."""
    print("💰 Zuzahlung expert agent called")

    # Create step for this expert agent
    create_step(
        state["session"],
        state["agent_run_id"],
        "zuzahlung_expert",
        "Analyzing co-payment related inquiry",
        "running",
    )

    # Update run status
    update_agent_run_status(
        state["session"],
        state["agent_run_id"],
        "running",
        "Zuzahlung expert analyzing request",
    )

    system_message = SystemMessage(
        content="""Du bist ein Experte für Zuzahlungen bei einer deutschen Krankenkasse.
        Analysiere die Kundenanfrage und sammle wichtige Informationen und Überlegungen zu:
        - Zuzahlungen bei Medikamenten, Hilfsmitteln, Therapien
        - Eigenanteilen und deren Berechnung
        - Zuzahlungsbefreiungen und deren Beantragung
        - Belastungsgrenzen und jährlichen Höchstbeträgen
        - Quittungen und Nachweisen für Zuzahlungen

        Erstelle KEINE direkte Antwort an den Kunden, sondern sammle alle relevanten Informationen, 
        wichtige Punkte und Überlegungen, die für die finale E-Mail-Antwort wichtig sind.
        Strukturiere deine Analyse klar und präzise."""
    )

    messages_with_system = [system_message] + state["messages"]
    response = llm.invoke(messages_with_system)

    print("✅ Zuzahlung expert completed analysis")

    # Update step to completed
    steps = (
        state["session"]
        .query(Step)
        .filter(
            Step.agent_run_id == state["agent_run_id"], Step.type == "zuzahlung_expert"
        )
        .order_by(Step.id.desc())
        .first()
    )
    if steps:
        steps.status = "completed"
        steps.text = "Completed analysis of co-payment inquiry"
        state["session"].add(steps)
        state["session"].commit()

    return {
        "expert_analysis": response.content,
    }


def familienversicherung_expert(state: State):
    """Expert agent for family insurance inquiries."""
    print("👨‍👩‍👧‍👦 Familienversicherung expert agent called")

    # Create step for this expert agent
    create_step(
        state["session"],
        state["agent_run_id"],
        "familienversicherung_expert",
        "Analyzing family insurance inquiry",
        "running",
    )

    # Update run status
    update_agent_run_status(
        state["session"],
        state["agent_run_id"],
        "running",
        "Familienversicherung expert analyzing request",
    )

    system_message = SystemMessage(
        content="""Du bist ein Experte für Familienversicherung bei einer deutschen Krankenkasse.
        Analysiere die Kundenanfrage und sammle wichtige Informationen und Überlegungen zu:
        - Mitversicherung von Ehepartnern und Kindern
        - Voraussetzungen für die Familienversicherung
        - Einkommensgrenzen und deren Überschreitung
        - Anmeldung und Abmeldung von Familienmitgliedern
        - Übergang zwischen Familienversicherung und eigener Versicherung

        Erstelle KEINE direkte Antwort an den Kunden, sondern sammle alle relevanten Informationen, 
        wichtige Punkte und Überlegungen, die für die finale E-Mail-Antwort wichtig sind.
        Strukturiere deine Analyse klar und präzise."""
    )

    messages_with_system = [system_message] + state["messages"]
    response = llm.invoke(messages_with_system)

    print("✅ Familienversicherung expert completed analysis")

    # Update step to completed
    steps = (
        state["session"]
        .query(Step)
        .filter(
            Step.agent_run_id == state["agent_run_id"],
            Step.type == "familienversicherung_expert",
        )
        .order_by(Step.id.desc())
        .first()
    )
    if steps:
        steps.status = "completed"
        steps.text = "Completed analysis of family insurance inquiry"
        state["session"].add(steps)
        state["session"].commit()

    return {
        "expert_analysis": response.content,
    }


def pflegeversicherung_expert(state: State):
    """Expert agent for care insurance inquiries."""
    print("🏥 Pflegeversicherung expert agent called")

    # Create step for this expert agent
    create_step(
        state["session"],
        state["agent_run_id"],
        "pflegeversicherung_expert",
        "Analyzing care insurance inquiry",
        "running",
    )

    # Update run status
    update_agent_run_status(
        state["session"],
        state["agent_run_id"],
        "running",
        "Pflegeversicherung expert analyzing request",
    )

    system_message = SystemMessage(
        content="""Du bist ein Experte für Pflegeversicherung bei einer deutschen Krankenkasse.
        Analysiere die Kundenanfrage und sammle wichtige Informationen und Überlegungen zu:
        - Pflegegraden und deren Beantragung
        - Leistungen der Pflegeversicherung
        - Pflegegeld und Pflegesachleistungen
        - Kombination von Geld- und Sachleistungen
        - Verhinderungspflege und Kurzzeitpflege
        - Pflegehilfsmitteln und Wohnraumanpassungen

        Erstelle KEINE direkte Antwort an den Kunden, sondern sammle alle relevanten Informationen, 
        wichtige Punkte und Überlegungen, die für die finale E-Mail-Antwort wichtig sind.
        Strukturiere deine Analyse klar und präzise."""
    )

    messages_with_system = [system_message] + state["messages"]
    response = llm.invoke(messages_with_system)

    print("✅ Pflegeversicherung expert completed analysis")

    # Update step to completed
    steps = (
        state["session"]
        .query(Step)
        .filter(
            Step.agent_run_id == state["agent_run_id"],
            Step.type == "pflegeversicherung_expert",
        )
        .order_by(Step.id.desc())
        .first()
    )
    if steps:
        steps.status = "completed"
        steps.text = "Completed analysis of care insurance inquiry"
        state["session"].add(steps)
        state["session"].commit()

    return {
        "expert_analysis": response.content,
    }


def krankengeld_expert(state: State):
    """Expert agent for sick pay inquiries."""
    print("🤒 Krankengeld expert agent called")

    # Create step for this expert agent
    create_step(
        state["session"],
        state["agent_run_id"],
        "krankengeld_expert",
        "Analyzing sick pay inquiry",
        "running",
    )

    # Update run status
    update_agent_run_status(
        state["session"],
        state["agent_run_id"],
        "running",
        "Krankengeld expert analyzing request",
    )

    system_message = SystemMessage(
        content="""Du bist ein Experte für Krankengeld bei einer deutschen Krankenkasse.
        Analysiere die Kundenanfrage und sammle wichtige Informationen und Überlegungen zu:
        - Krankengeld-Anträgen und deren Bearbeitung
        - Arbeitsunfähigkeitsbescheinigungen
        - Höhe und Berechnung des Krankengeldes
        - Dauer der Krankengeld-Zahlung
        - Übergang von Lohnfortzahlung zu Krankengeld
        - Wiedereingliederungsmaßnahmen

        Erstelle KEINE direkte Antwort an den Kunden, sondern sammle alle relevanten Informationen, 
        wichtige Punkte und Überlegungen, die für die finale E-Mail-Antwort wichtig sind.
        Strukturiere deine Analyse klar und präzise."""
    )

    messages_with_system = [system_message] + state["messages"]
    response = llm.invoke(messages_with_system)

    print("✅ Krankengeld expert completed analysis")

    # Update step to completed
    steps = (
        state["session"]
        .query(Step)
        .filter(
            Step.agent_run_id == state["agent_run_id"],
            Step.type == "krankengeld_expert",
        )
        .order_by(Step.id.desc())
        .first()
    )
    if steps:
        steps.status = "completed"
        steps.text = "Completed analysis of sick pay inquiry"
        state["session"].add(steps)
        state["session"].commit()

    return {
        "expert_analysis": response.content,
    }


def kostenuebernahme_expert(state: State):
    """Expert agent for cost coverage and reimbursement inquiries."""
    print("💳 Kostenübernahme expert agent called")

    # Create step for this expert agent
    create_step(
        state["session"],
        state["agent_run_id"],
        "kostenuebernahme_expert",
        "Analyzing cost coverage inquiry",
        "running",
    )

    # Update run status
    update_agent_run_status(
        state["session"],
        state["agent_run_id"],
        "running",
        "Kostenübernahme expert analyzing request",
    )

    system_message = SystemMessage(
        content="""Du bist ein Experte für Kostenübernahme und Erstattungen bei einer deutschen Krankenkasse.
        Analysiere die Kundenanfrage und sammle wichtige Informationen und Überlegungen zu:
        - Kostenübernahme-Anträgen für Behandlungen und Therapien
        - Erstattung von Privatrechnungen und Notfallbehandlungen
        - Genehmigungsverfahren für teure Behandlungen
        - Kostenvoranschläge und deren Prüfung
        - Auslandsbehandlungen und deren Erstattung
        - Hilfsmittel-Kostenübernahme
        - Zweitmeinungsverfahren

        Erstelle KEINE direkte Antwort an den Kunden, sondern sammle alle relevanten Informationen, 
        wichtige Punkte und Überlegungen, die für die finale E-Mail-Antwort wichtig sind.
        Strukturiere deine Analyse klar und präzise."""
    )

    messages_with_system = [system_message] + state["messages"]
    response = llm.invoke(messages_with_system)

    print("✅ Kostenübernahme expert completed analysis")

    # Update step to completed
    steps = (
        state["session"]
        .query(Step)
        .filter(
            Step.agent_run_id == state["agent_run_id"],
            Step.type == "kostenuebernahme_expert",
        )
        .order_by(Step.id.desc())
        .first()
    )
    if steps:
        steps.status = "completed"
        steps.text = "Completed analysis of cost coverage inquiry"
        state["session"].add(steps)
        state["session"].commit()

    return {
        "expert_analysis": response.content,
    }


def widerspruch_expert(state: State):
    """Expert agent for appeals and objections."""
    print("⚖️ Widerspruch expert agent called")

    # Create step for this expert agent
    create_step(
        state["session"],
        state["agent_run_id"],
        "widerspruch_expert",
        "Analyzing appeals and objections inquiry",
        "running",
    )

    # Update run status
    update_agent_run_status(
        state["session"],
        state["agent_run_id"],
        "running",
        "Widerspruch expert analyzing request",
    )

    system_message = SystemMessage(
        content="""Du bist ein Experte für Widersprüche und Rechtsmittel bei einer deutschen Krankenkasse.
        Analysiere die Kundenanfrage und sammle wichtige Informationen und Überlegungen zu:
        - Widerspruchsverfahren gegen Ablehnungsbescheide
        - Fristen für Widersprüche und deren Einhaltung
        - Erforderliche Unterlagen und Begründungen
        - Widerspruchsausschüsse und deren Verfahren
        - Sozialgerichtsverfahren als nächste Instanz
        - Einstweilige Anordnungen bei dringenden Fällen
        - Rechtsbeistand und Beratung

        Erstelle KEINE direkte Antwort an den Kunden, sondern sammle alle relevanten Informationen, 
        wichtige Punkte und Überlegungen, die für die finale E-Mail-Antwort wichtig sind.
        Strukturiere deine Analyse klar und präzise."""
    )

    messages_with_system = [system_message] + state["messages"]
    response = llm.invoke(messages_with_system)

    print("✅ Widerspruch expert completed analysis")

    # Update step to completed
    steps = (
        state["session"]
        .query(Step)
        .filter(
            Step.agent_run_id == state["agent_run_id"],
            Step.type == "widerspruch_expert",
        )
        .order_by(Step.id.desc())
        .first()
    )
    if steps:
        steps.status = "completed"
        steps.text = "Completed analysis of appeals and objections inquiry"
        state["session"].add(steps)
        state["session"].commit()

    return {
        "expert_analysis": response.content,
    }


def mutterschaft_expert(state: State):
    """Expert agent for maternity and pregnancy inquiries."""
    print("🤱 Mutterschaft expert agent called")

    # Create step for this expert agent
    create_step(
        state["session"],
        state["agent_run_id"],
        "mutterschaft_expert",
        "Analyzing maternity and pregnancy inquiry",
        "running",
    )

    # Update run status
    update_agent_run_status(
        state["session"],
        state["agent_run_id"],
        "running",
        "Mutterschaft expert analyzing request",
    )

    system_message = SystemMessage(
        content="""Du bist ein Experte für Mutterschaft und Schwangerschaft bei einer deutschen Krankenkasse.
        Analysiere die Kundenanfrage und sammle wichtige Informationen und Überlegungen zu:
        - Vorsorgeuntersuchungen während der Schwangerschaft
        - Mutterschaftsgeld und dessen Beantragung
        - Hebammenleistungen und deren Abrechnung
        - Geburtsvorbereitungskurse und Rückbildungsgymnastik
        - Zusätzliche Leistungen für Schwangere
        - Mutterschutzfristen und Elternzeit
        - Familienversicherung für Neugeborene

        Erstelle KEINE direkte Antwort an den Kunden, sondern sammle alle relevanten Informationen, 
        wichtige Punkte und Überlegungen, die für die finale E-Mail-Antwort wichtig sind.
        Strukturiere deine Analyse klar und präzise."""
    )

    messages_with_system = [system_message] + state["messages"]
    response = llm.invoke(messages_with_system)

    print("✅ Mutterschaft expert completed analysis")

    # Update step to completed
    steps = (
        state["session"]
        .query(Step)
        .filter(
            Step.agent_run_id == state["agent_run_id"],
            Step.type == "mutterschaft_expert",
        )
        .order_by(Step.id.desc())
        .first()
    )
    if steps:
        steps.status = "completed"
        steps.text = "Completed analysis of maternity and pregnancy inquiry"
        state["session"].add(steps)
        state["session"].commit()

    return {
        "expert_analysis": response.content,
    }


def rehabilitation_expert(state: State):
    """Expert agent for rehabilitation inquiries."""
    print("🏃‍♂️ Rehabilitation expert agent called")

    # Create step for this expert agent
    create_step(
        state["session"],
        state["agent_run_id"],
        "rehabilitation_expert",
        "Analyzing rehabilitation inquiry",
        "running",
    )

    # Update run status
    update_agent_run_status(
        state["session"],
        state["agent_run_id"],
        "running",
        "Rehabilitation expert analyzing request",
    )

    system_message = SystemMessage(
        content="""Du bist ein Experte für Rehabilitation und Kuren bei einer deutschen Krankenkasse.
        Analysiere die Kundenanfrage und sammle wichtige Informationen und Überlegungen zu:
        - Rehabilitationsmaßnahmen und deren Beantragung
        - Medizinische Voraussetzungen für Reha-Maßnahmen
        - Ambulante vs. stationäre Rehabilitation
        - Anschlussheilbehandlungen (AHB)
        - Präventionsmaßnahmen und Kuren
        - Reha-Einrichtungen und deren Auswahl
        - Zuzahlungen bei Reha-Maßnahmen
        - Nachsorge und Reha-Sport

        Erstelle KEINE direkte Antwort an den Kunden, sondern sammle alle relevanten Informationen, 
        wichtige Punkte und Überlegungen, die für die finale E-Mail-Antwort wichtig sind.
        Strukturiere deine Analyse klar und präzise."""
    )

    messages_with_system = [system_message] + state["messages"]
    response = llm.invoke(messages_with_system)

    print("✅ Rehabilitation expert completed analysis")

    # Update step to completed
    steps = (
        state["session"]
        .query(Step)
        .filter(
            Step.agent_run_id == state["agent_run_id"],
            Step.type == "rehabilitation_expert",
        )
        .order_by(Step.id.desc())
        .first()
    )
    if steps:
        steps.status = "completed"
        steps.text = "Completed analysis of rehabilitation inquiry"
        state["session"].add(steps)
        state["session"].commit()

    return {
        "expert_analysis": response.content,
    }


def terminvermittlung_expert(state: State):
    """Expert agent for appointment scheduling and mediation."""
    print("📅 Terminvermittlung expert agent called")

    # Create step for this expert agent
    create_step(
        state["session"],
        state["agent_run_id"],
        "terminvermittlung_expert",
        "Analyzing appointment scheduling inquiry",
        "running",
    )

    # Update run status
    update_agent_run_status(
        state["session"],
        state["agent_run_id"],
        "running",
        "Terminvermittlung expert analyzing request",
    )

    system_message = SystemMessage(
        content="""Du bist ein Experte für Terminvermittlung und Beratungstermine bei einer deutschen Krankenkasse.
        Analysiere die Kundenanfrage und sammle wichtige Informationen und Überlegungen zu:
        - Terminvereinbarungen für Beratungsgespräche
        - Facharzttermine und Terminservicestelle
        - Beschwerden über lange Wartezeiten
        - Dringende Terminvermittlung bei akuten Beschwerden
        - Zweitmeinungstermine
        - Telefonische vs. persönliche Beratungstermine
        - Sprechstunden und Öffnungszeiten
        - Online-Terminbuchung und digitale Services

        Erstelle KEINE direkte Antwort an den Kunden, sondern sammle alle relevanten Informationen, 
        wichtige Punkte und Überlegungen, die für die finale E-Mail-Antwort wichtig sind.
        Strukturiere deine Analyse klar und präzise."""
    )

    messages_with_system = [system_message] + state["messages"]
    response = llm.invoke(messages_with_system)

    print("✅ Terminvermittlung expert completed analysis")

    # Update step to completed
    steps = (
        state["session"]
        .query(Step)
        .filter(
            Step.agent_run_id == state["agent_run_id"],
            Step.type == "terminvermittlung_expert",
        )
        .order_by(Step.id.desc())
        .first()
    )
    if steps:
        steps.status = "completed"
        steps.text = "Completed analysis of appointment scheduling inquiry"
        state["session"].add(steps)
        state["session"].commit()

    return {
        "expert_analysis": response.content,
    }


def sonstiges_expert(state: State):
    """Expert agent for general inquiries."""
    print("📋 Sonstiges expert agent called")

    # Create step for this expert agent
    create_step(
        state["session"],
        state["agent_run_id"],
        "sonstiges_expert",
        "Analyzing general inquiry",
        "running",
    )

    # Update run status
    update_agent_run_status(
        state["session"],
        state["agent_run_id"],
        "running",
        "Sonstiges expert analyzing request",
    )

    system_message = SystemMessage(
        content="""Du bist ein Allgemein-Experte für eine deutsche Krankenkasse.
        Analysiere die Kundenanfrage und sammle wichtige Informationen und Überlegungen zu:
        - Verlorene oder defekte Versichertenkarten
        - Kontaktdaten und Bankverbindung ändern
        - Allgemeine Informationen zur Krankenversicherung
        - Umzug und Kassenwechsel
        - Bonusprogramme und Zusatzleistungen
        - Mitgliedschaft und Beiträge
        - Bescheinigungen und Nachweise

        Erstelle KEINE direkte Antwort an den Kunden, sondern sammle alle relevanten Informationen, 
        wichtige Punkte und Überlegungen, die für die finale E-Mail-Antwort wichtig sind.
        Strukturiere deine Analyse klar und präzise."""
    )

    messages_with_system = [system_message] + state["messages"]
    response = llm.invoke(messages_with_system)

    print("✅ Sonstiges expert completed analysis")

    # Update step to completed
    steps = (
        state["session"]
        .query(Step)
        .filter(
            Step.agent_run_id == state["agent_run_id"], Step.type == "sonstiges_expert"
        )
        .order_by(Step.id.desc())
        .first()
    )
    if steps:
        steps.status = "completed"
        steps.text = "Completed analysis of general inquiry"
        state["session"].add(steps)
        state["session"].commit()

    return {
        "expert_analysis": response.content,
    }


def email_drafter_agent(state: State):
    """Agent that drafts a professional email response to the customer."""
    print("✉️ Email drafter agent called")

    # Create step for email drafter
    create_step(
        state["session"],
        state["agent_run_id"],
        "email_drafter",
        "Drafting professional email response",
        "running",
    )

    # Update run status
    update_agent_run_status(
        state["session"], state["agent_run_id"], "running", "Drafting email response"
    )

    # Get the conversation history to understand the context
    conversation_context = ""
    for msg in state["messages"]:
        if hasattr(msg, "content"):
            conversation_context += f"{msg.content}\n"

    expert_analysis = state.get("expert_analysis", "")

    system_message = SystemMessage(
        content=f"""Du bist ein professioneller E-Mail-Verfasser für eine deutsche Krankenkasse.

Deine Aufgabe ist es, basierend auf der folgenden Kundenanfrage und der Expertenanalyse eine professionelle, empathische und hilfreiche E-Mail-Antwort an den Kunden zu verfassen.

Kundenanfrage:
{conversation_context}

Expertenanalyse:
{expert_analysis}

Schreibe eine vollständige E-Mail-Antwort, die:
- Professionell und höflich ist
- Alle wichtigen Informationen aus der Expertenanalyse berücksichtigt
- Konkrete nächste Schritte aufzeigt
- Bei Bedarf Kontaktdaten oder weitere Hilfsangebote enthält
- Mit einer angemessenen Grußformel endet
- Vollständig auf Deutsch verfasst ist

Beginne die E-Mail mit einer passenden Anrede und beende sie mit einer professionellen Grußformel.
Verwende einen empathischen, aber sachlichen Ton."""
    )

    messages_with_system = [system_message] + [
        state["messages"][-1]
    ]  # Only use the last message
    response = llm.invoke(messages_with_system)
    print("✅ Email drafter completed response")

    # Update step to completed
    steps = (
        state["session"]
        .query(Step)
        .filter(
            Step.agent_run_id == state["agent_run_id"], Step.type == "email_drafter"
        )
        .order_by(Step.id.desc())
        .first()
    )
    if steps:
        steps.status = "completed"
        steps.text = "Completed email draft"
        state["session"].add(steps)
        state["session"].commit()

    # Update final run status and save draft
    agent_run = state["session"].get(AgentRun, state["agent_run_id"])
    if agent_run:
        agent_run.status = "completed"
        agent_run.status_message = "Email response generated successfully"
        agent_run.draft_body = response.content
        agent_run.draft_subject = f"Re: {agent_run.mail_subject}"
        state["session"].add(agent_run)
        state["session"].commit()

    return {"messages": [response]}


def route_to_expert(
    state: State,
) -> Literal[
    "zuzahlung",
    "familienversicherung",
    "pflegeversicherung",
    "krankengeld",
    "kostenuebernahme",
    "widerspruch",
    "mutterschaft",
    "rehabilitation",
    "terminvermittlung",
    "sonstiges",
]:
    """Routing function that determines which expert agent to call next."""
    return state["next_agent"]


# Add all nodes to the graph
graph_builder.add_node("master", master_agent)
graph_builder.add_node("zuzahlung", zuzahlung_expert)
graph_builder.add_node("familienversicherung", familienversicherung_expert)
graph_builder.add_node("pflegeversicherung", pflegeversicherung_expert)
graph_builder.add_node("krankengeld", krankengeld_expert)
graph_builder.add_node("kostenuebernahme", kostenuebernahme_expert)
graph_builder.add_node("widerspruch", widerspruch_expert)
graph_builder.add_node("mutterschaft", mutterschaft_expert)
graph_builder.add_node("rehabilitation", rehabilitation_expert)
graph_builder.add_node("terminvermittlung", terminvermittlung_expert)
graph_builder.add_node("sonstiges", sonstiges_expert)
graph_builder.add_node("email_drafter", email_drafter_agent)

# Define the flow
graph_builder.add_edge(START, "master")
graph_builder.add_conditional_edges("master", route_to_expert)

# All expert agents end the conversation
graph_builder.add_edge("zuzahlung", "email_drafter")
graph_builder.add_edge("familienversicherung", "email_drafter")
graph_builder.add_edge("pflegeversicherung", "email_drafter")
graph_builder.add_edge("krankengeld", "email_drafter")
graph_builder.add_edge("kostenuebernahme", "email_drafter")
graph_builder.add_edge("widerspruch", "email_drafter")
graph_builder.add_edge("mutterschaft", "email_drafter")
graph_builder.add_edge("rehabilitation", "email_drafter")
graph_builder.add_edge("terminvermittlung", "email_drafter")
graph_builder.add_edge("sonstiges", "email_drafter")

# Only the email drafter ends the conversation
graph_builder.add_edge("email_drafter", END)

graph = graph_builder.compile()


def run_graph(mail: str, session: Session, agent_run_id: uuid.UUID):
    print("🚀 Starting agent workflow")
    result = graph.invoke(
        {
            "messages": [HumanMessage(content=mail)],
            "session": session,
            "agent_run_id": agent_run_id,
        }
    )
    print("🏁 Agent workflow completed")
    print("MESSAGES", result)
    return result["messages"][-1].content
