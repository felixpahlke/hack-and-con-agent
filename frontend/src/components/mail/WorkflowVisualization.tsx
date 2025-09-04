import { useState, useEffect } from "react";

export interface WorkflowStep {
  id: string;
  name: string;
  icon: string;
  message: string;
  status: "pending" | "running" | "completed" | "error";
  timestamp?: Date;
}

interface AgentRun {
  steps: Array<{
    id: string;
    type: string;
    text: string;
    status: string;
    created_at?: string;
  }>;
  status: string;
  status_message: string;
  draft_body: string;
  draft_subject: string;
}

interface WorkflowVisualizationProps {
  isActive: boolean;
  agentRun?: AgentRun;
  onComplete?: () => void;
  onShowTemplate?: (templateData: { subject: string; body: string }) => void;
}

const STEP_MAPPING = {
  master_agent: {
    name: "Master Agent",
    icon: "🎯",
    message:
      "Analysiert Kundenanfrage und bestimmt zuständigen Experten-Agent...",
  },
  zuzahlung_expert: {
    name: "Zuzahlung Experte",
    icon: "💰",
    message: "Analysiert Zuzahlungs- und Eigenanteil-Anfragen...",
  },
  familienversicherung_expert: {
    name: "Familienversicherung Experte",
    icon: "👨‍👩‍👧‍👦",
    message: "Analysiert Familienversicherungs-Anfragen...",
  },
  pflegeversicherung_expert: {
    name: "Pflegeversicherung Experte",
    icon: "🏥",
    message: "Analysiert Pflegeversicherungs-Anfragen...",
  },
  krankengeld_expert: {
    name: "Krankengeld Experte",
    icon: "🤒",
    message: "Analysiert Krankengeld-Anfragen...",
  },
  kostenuebernahme_expert: {
    name: "Kostenübernahme Experte",
    icon: "💳",
    message: "Analysiert Kostenübernahme-Anfragen...",
  },
  widerspruch_expert: {
    name: "Widerspruch Experte",
    icon: "⚖️",
    message: "Analysiert Widerspruchs-Anfragen...",
  },
  mutterschaft_expert: {
    name: "Mutterschaft Experte",
    icon: "🤱",
    message: "Analysiert Mutterschafts-Anfragen...",
  },
  rehabilitation_expert: {
    name: "Rehabilitation Experte",
    icon: "🏃‍♂️",
    message: "Analysiert Rehabilitations-Anfragen...",
  },
  terminvermittlung_expert: {
    name: "Terminvermittlung Experte",
    icon: "📅",
    message: "Analysiert Terminvermittlungs-Anfragen...",
  },
  sonstiges_expert: {
    name: "Allgemein Experte",
    icon: "📋",
    message: "Analysiert allgemeine Anfragen...",
  },
  email_drafter: {
    name: "E-Mail Verfasser",
    icon: "✉️",
    message: "Erstellt professionelle, empathische E-Mail-Antwort...",
  },
};

export function WorkflowVisualization({
  isActive,
  agentRun,
  onComplete,
  onShowTemplate,
}: WorkflowVisualizationProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [showTemplate, setShowTemplate] = useState(false);
  const [editableSubject, setEditableSubject] = useState("");
  const [editableBody, setEditableBody] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!agentRun) {
      // Initialize with start step when workflow begins
      if (isActive) {
        setSteps([
          {
            id: "start",
            name: "Workflow gestartet",
            icon: "🚀",
            message: "Agent Workflow wird initialisiert...",
            status: "running",
            timestamp: new Date(),
          },
        ]);
      }
      return;
    }

    // Convert backend steps to frontend workflow steps
    const workflowSteps: WorkflowStep[] = [];

    // Always start with the start step
    workflowSteps.push({
      id: "start",
      name: "Workflow gestartet",
      icon: "🚀",
      message: "Agent Workflow initialisiert",
      status: "completed",
      timestamp: new Date(),
    });

    // Sort backend steps by created_at before mapping
    const sortedSteps = [...agentRun.steps].sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      // Add Z to the end of created_at to indicate UTC timestamp
      const timestampA = a.created_at.endsWith("Z")
        ? a.created_at
        : `${a.created_at}Z`;
      const timestampB = b.created_at.endsWith("Z")
        ? b.created_at
        : `${b.created_at}Z`;
      return new Date(timestampA).getTime() - new Date(timestampB).getTime();
    });

    // Map sorted backend steps to frontend steps
    sortedSteps.forEach((step) => {
      const stepConfig = STEP_MAPPING[step.type as keyof typeof STEP_MAPPING];
      if (stepConfig) {
        // Add Z to the end of created_at to indicate UTC timestamp
        const timestamp = step.created_at
          ? step.created_at.endsWith("Z")
            ? step.created_at
            : `${step.created_at}Z`
          : null;

        workflowSteps.push({
          id: step.id,
          name: stepConfig.name,
          icon: stepConfig.icon,
          message: step.text,
          status: step.status as "pending" | "running" | "completed" | "error",
          timestamp: timestamp ? new Date(timestamp) : new Date(),
        });
      }
    });

    // Add completion step if workflow is done
    if (agentRun.status === "completed") {
      workflowSteps.push({
        id: "complete",
        name: "Abgeschlossen",
        icon: "🏁",
        message:
          "Agent Workflow erfolgreich abgeschlossen - E-Mail-Antwort bereit",
        status: "completed",
        timestamp: new Date(),
      });
    }

    setSteps(workflowSteps);

    // Initialize editable content
    if (agentRun.draft_subject && agentRun.draft_body) {
      setEditableSubject(agentRun.draft_subject);
      setEditableBody(agentRun.draft_body);
    }

    // Call onComplete when workflow is finished
    if (agentRun.status === "completed" && onComplete) {
      onComplete();
    }
  }, [agentRun, isActive, onComplete]);

  const getStepStatusColor = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "pending":
        return "text-muted-foreground";
      case "running":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStepStatusBg = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "pending":
        return "bg-muted";
      case "running":
        return "bg-blue-500/10 border-blue-500/20";
      case "completed":
        return "bg-green-500/10 border-green-500/20";
      case "error":
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-muted";
    }
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    if (onShowTemplate) {
      onShowTemplate({
        subject: editableSubject,
        body: editableBody,
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (agentRun) {
      setEditableSubject(agentRun.draft_subject);
      setEditableBody(agentRun.draft_body);
    }
  };

  if (showTemplate && agentRun?.draft_body) {
    return (
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-accent rounded-full p-2">
              <svg
                className="h-5 w-5 text-accent-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              E-Mail Vorlage
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>Bearbeiten</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center space-x-1 rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Speichern</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-1 rounded-lg bg-gray-500 px-3 py-2 text-sm text-white hover:bg-gray-600"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Abbrechen</span>
                </button>
              </div>
            )}
            <button
              onClick={() => setShowTemplate(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-auto">
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-2 font-medium text-foreground">Betreff:</h4>
            {isEditing ? (
              <input
                type="text"
                value={editableSubject}
                onChange={(e) => setEditableSubject(e.target.value)}
                className="input-enhanced w-full"
                placeholder="E-Mail Betreff eingeben..."
              />
            ) : (
              <p className="rounded border bg-background p-2 text-sm text-foreground">
                {editableSubject}
              </p>
            )}
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-2 font-medium text-foreground">E-Mail Text:</h4>
            {isEditing ? (
              <textarea
                value={editableBody}
                onChange={(e) => setEditableBody(e.target.value)}
                className="input-enhanced min-h-96 w-full resize-none"
                placeholder="E-Mail Text eingeben..."
              />
            ) : (
              <div className="max-h-[30rem] overflow-auto whitespace-pre-wrap rounded border bg-background p-4 text-foreground">
                {editableBody}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center space-x-2">
        <div className="bg-gradient-accent rounded-full p-2">
          <svg
            className="h-5 w-5 text-accent-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Workflow Visualisierung
        </h3>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative rounded-lg border p-4 transition-all duration-300 ${getStepStatusBg(step.status)}`}
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 h-8 w-0.5 bg-muted-foreground/20"></div>
              )}

              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${getStepStatusBg(step.status)}`}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4
                      className={`font-medium ${getStepStatusColor(step.status)}`}
                    >
                      {step.name}
                    </h4>
                    {step.status === "running" && (
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    )}
                    {step.status === "completed" && (
                      <svg
                        className="h-4 w-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {step.status === "error" && (
                      <svg
                        className="h-4 w-4 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.message}
                  </p>
                  {step.timestamp && (
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      {step.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show Template Button when workflow is completed */}
        {agentRun?.status === "completed" && agentRun.draft_body && (
          <div className="mt-6 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">✉️</span>
                <div>
                  <h4 className="font-medium text-green-600">
                    E-Mail Vorlage bereit
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Die generierte E-Mail-Antwort kann jetzt angezeigt werden
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplate(true)}
                className="btn-primary-gradient"
              >
                Vorlage anzeigen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
