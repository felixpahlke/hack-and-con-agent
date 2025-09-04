# Mail Workflow Visualization

This directory contains components for the mail interface with an integrated AI agent workflow visualization.

## Components

### MailLayout.tsx
Main layout component that orchestrates the mail list, mail detail, and AI assistant panels.

### WorkflowVisualization.tsx
Visualizes the agentic workflow process when the "Assistent aktivieren" button is clicked.

## Workflow Visualization Features

The workflow visualization shows the internal processing steps of the AI agent system:

1. **🚀 Workflow gestartet** - Initialization of the agent workflow
2. **🎯 Master Agent** - Analyzes customer inquiry and determines the appropriate expert agent
3. **🧠 Experten-Agent** - Expert agent analyzes the specific inquiry and collects relevant information
4. **✉️ E-Mail Verfasser** - Creates professional, empathetic email response based on expert analysis
5. **🏁 Abgeschlossen** - Workflow completed successfully

### Expert Agents
The system includes specialized expert agents for different types of inquiries:
- 💰 Zuzahlung Experte - Co-payment related inquiries
- 👨‍👩‍👧‍👦 Familienversicherung Experte - Family insurance inquiries
- 🏥 Pflegeversicherung Experte - Care insurance inquiries
- 🤒 Krankengeld Experte - Sick pay inquiries
- 💳 Kostenübernahme Experte - Cost coverage and reimbursement inquiries
- ⚖️ Widerspruch Experte - Appeals and objections
- 🤱 Mutterschaft Experte - Maternity and pregnancy inquiries
- 🏃‍♂️ Rehabilitation Experte - Rehabilitation inquiries
- 📅 Terminvermittlung Experte - Appointment scheduling and mediation
- 📋 Allgemein Experte - General inquiries

### Visual Features
- Real-time step progression with animated indicators
- Status-based color coding (pending, active, completed)
- Connection lines between steps
- Timestamps for each step
- Expert agent selection display
- Smooth transitions and animations

## Usage

The workflow visualization automatically starts when the "Assistent aktivieren" button is clicked in the mail interface. It simulates the actual backend agent workflow and provides visual feedback to users about the processing status.
