import { useState, useEffect } from "react";

export interface WorkflowStep {
  id: string;
  name: string;
  icon: string;
  message: string;
  status: "pending" | "active" | "completed" | "error";
  timestamp: Date;
}

interface WorkflowVisualizationProps {
  isActive: boolean;
  onComplete?: () => void;
}

const WORKFLOW_STEPS: Omit<WorkflowStep, "status" | "timestamp">[] = [
  {
    id: "start",
    name: "Workflow gestartet",
    icon: "🚀",
    message: "Agent Workflow wird initialisiert...",
  },
  {
    id: "master",
    name: "Master Agent",
    icon: "🎯",
    message: "Analysiert Kundenanfrage und bestimmt zuständigen Experten-Agent...",
  },
  {
    id: "expert",
    name: "Experten-Agent",
    icon: "🧠",
    message: "Experten-Agent analysiert spezifische Anfrage und sammelt Informationen...",
  },
  {
    id: "email_drafter",
    name: "E-Mail Verfasser",
    icon: "✉️",
    message: "Erstellt professionelle, empathische E-Mail-Antwort basierend auf Expertenanalyse...",
  },
  {
    id: "complete",
    name: "Abgeschlossen",
    icon: "🏁",
    message: "Agent Workflow erfolgreich abgeschlossen - E-Mail-Antwort bereit",
  },
];

const EXPERT_AGENTS = {
  zuzahlung: { name: "Zuzahlung Experte", icon: "💰" },
  familienversicherung: { name: "Familienversicherung Experte", icon: "👨‍👩‍👧‍👦" },
  pflegeversicherung: { name: "Pflegeversicherung Experte", icon: "🏥" },
  krankengeld: { name: "Krankengeld Experte", icon: "🤒" },
  kostenuebernahme: { name: "Kostenübernahme Experte", icon: "💳" },
  widerspruch: { name: "Widerspruch Experte", icon: "⚖️" },
  mutterschaft: { name: "Mutterschaft Experte", icon: "🤱" },
  rehabilitation: { name: "Rehabilitation Experte", icon: "🏃‍♂️" },
  terminvermittlung: { name: "Terminvermittlung Experte", icon: "📅" },
  sonstiges: { name: "Allgemein Experte", icon: "📋" },
};

export function WorkflowVisualization({ isActive, onComplete }: WorkflowVisualizationProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);

  useEffect(() => {
    if (isActive) {
      // Initialize workflow steps
      const initialSteps = WORKFLOW_STEPS.map((step, index) => ({
        ...step,
        status: index === 0 ? "active" : "pending",
        timestamp: new Date(),
      }));
      setSteps(initialSteps);
      setCurrentStepIndex(0);
      setSelectedExpert(null);

             // Simulate workflow progression
       const simulateWorkflow = async () => {
         // Step 1: Start
         await new Promise(resolve => setTimeout(resolve, 800));
         setSteps(prev => prev.map((step, index) => 
           index === 0 ? { ...step, status: "completed" } : 
           index === 1 ? { ...step, status: "active" } : step
         ));
         setCurrentStepIndex(1);

         // Step 2: Master Agent (with random expert selection)
         await new Promise(resolve => setTimeout(resolve, 1800));
         const expertKeys = Object.keys(EXPERT_AGENTS);
         const randomExpert = expertKeys[Math.floor(Math.random() * expertKeys.length)];
         setSelectedExpert(randomExpert);
         
         setSteps(prev => prev.map((step, index) => 
           index === 1 ? { ...step, status: "completed" } : 
           index === 2 ? { 
             ...step, 
             status: "active",
             name: `${EXPERT_AGENTS[randomExpert as keyof typeof EXPERT_AGENTS].name}`,
             icon: EXPERT_AGENTS[randomExpert as keyof typeof EXPERT_AGENTS].icon,
             message: `${EXPERT_AGENTS[randomExpert as keyof typeof EXPERT_AGENTS].name} analysiert spezifische Anfrage und sammelt relevante Informationen...`
           } : step
         ));
         setCurrentStepIndex(2);

         // Step 3: Expert Agent
         await new Promise(resolve => setTimeout(resolve, 2200));
         setSteps(prev => prev.map((step, index) => 
           index === 2 ? { ...step, status: "completed" } : 
           index === 3 ? { ...step, status: "active" } : step
         ));
         setCurrentStepIndex(3);

         // Step 4: Email Drafter
         await new Promise(resolve => setTimeout(resolve, 1800));
         setSteps(prev => prev.map((step, index) => 
           index === 3 ? { ...step, status: "completed" } : 
           index === 4 ? { ...step, status: "active" } : step
         ));
         setCurrentStepIndex(4);

         // Step 5: Complete
         await new Promise(resolve => setTimeout(resolve, 800));
         setSteps(prev => prev.map((step, index) => 
           index === 4 ? { ...step, status: "completed" } : step
         ));
         setCurrentStepIndex(4);

         // Call onComplete after workflow is done
         setTimeout(() => {
           onComplete?.();
         }, 500);
       };

      simulateWorkflow();
    }
  }, [isActive, onComplete]);

  const getStepStatusColor = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "pending":
        return "text-muted-foreground";
      case "active":
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
      case "active":
        return "bg-blue-500/10 border-blue-500/20";
      case "completed":
        return "bg-green-500/10 border-green-500/20";
      case "error":
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-muted";
    }
  };

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
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${getStepStatusBg(step.status)}`}>
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-medium ${getStepStatusColor(step.status)}`}>
                      {step.name}
                    </h4>
                    {step.status === "active" && (
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: "0.1s" }}></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    )}
                    {step.status === "completed" && (
                      <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.message}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    {step.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expert Selection Display */}
        {selectedExpert && (
          <div className="mt-6 rounded-lg bg-blue-500/5 border border-blue-500/20 p-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{EXPERT_AGENTS[selectedExpert as keyof typeof EXPERT_AGENTS].icon}</span>
              <div>
                <h4 className="font-medium text-blue-600">
                  Ausgewählter Experte
                </h4>
                <p className="text-sm text-muted-foreground">
                  {EXPERT_AGENTS[selectedExpert as keyof typeof EXPERT_AGENTS].name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
