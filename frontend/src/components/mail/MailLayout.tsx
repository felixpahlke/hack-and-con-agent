import { useRef, useState } from "react";
import { MailList } from "./MailList";
import { MailDetail } from "./MailDetail";
import { Mail } from "./types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AgentService } from "@/client/services";
import { WorkflowVisualization } from "./WorkflowVisualization";

export function MailLayout() {
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [templateData, setTemplateData] = useState<{
    subject: string;
    body: string;
  } | null>(null);
  const agentRunId = useRef<string | undefined>(undefined);

  const handleMailSelect = (mail: Mail) => {
    setSelectedMail(mail);
    agentRunId.current = undefined;
    setShowWorkflow(false);
    setShowTemplate(false);
    setTemplateData(null);
  };

  const { data: agentStatus, isPending: isAgentStatusPending } = useQuery({
    queryKey: ["agentStatus", agentRunId.current],
    queryFn: () =>
      AgentService.agentGetAgentRun({ runId: agentRunId.current ?? "" }),
    enabled: !!agentRunId.current,
    refetchInterval: 1000,
  });

  console.log(agentStatus);

  const {
    mutate: startAgent,
    data: agentResponse,
    isPending,
  } = useMutation({
    mutationFn: (mail: Mail) => {
      return AgentService.agentStartAgent({
        subject: mail.subject,
        body: mail.body,
        sender: mail.sender,
      });
    },
    onSuccess: (data) => {
      agentRunId.current = data.run_id;
      setShowWorkflow(true);
      setShowTemplate(false);
      setTemplateData(null);
    },
  });

  const handleStartAgent = (mail: Mail) => {
    setShowWorkflow(true);
    setShowTemplate(false);
    startAgent(mail);
  };

  const handleShowTemplate = (template: { subject: string; body: string }) => {
    setTemplateData(template);
    setShowTemplate(true);
    setShowWorkflow(false);
  };

  const handleBackToWorkflow = () => {
    setShowTemplate(false);
    setShowWorkflow(true);
  };

  console.log(agentRunId.current);

  return (
    <div className="flex h-[calc(100vh-120px)] w-full gap-6 p-2">
      {/* Left Panel - Mail List */}
      <div className="card-gradient flex w-1/4 min-w-[400px] flex-col overflow-hidden">
        <MailList
          selectedMailId={selectedMail?.id}
          onMailSelect={handleMailSelect}
        />
      </div>

      {/* Right Side - Two Panels */}
      <div className="flex flex-1 gap-6">
        {/* Left Right Panel - Mail Content */}
        <div className="card-gradient flex-1 overflow-hidden">
          <MailDetail mail={selectedMail} />
        </div>

        {/* Right Right Panel - AI Assistant */}
        <div className="card-gradient flex-1 overflow-hidden p-6">
          {showTemplate && templateData ? (
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
                <button
                  onClick={handleBackToWorkflow}
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

              <div className="flex-1 space-y-4 overflow-auto">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h4 className="mb-2 font-medium text-foreground">Betreff:</h4>
                  <p className="rounded border bg-background p-2 text-sm text-foreground">
                    {templateData.subject}
                  </p>
                </div>

                <div className="rounded-lg border bg-muted/50 p-4">
                  <h4 className="mb-2 font-medium text-foreground">
                    E-Mail Text:
                  </h4>
                  <div className="max-h-96 overflow-auto whitespace-pre-wrap rounded border bg-background p-4 text-sm text-foreground">
                    {templateData.body}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 border-t pt-4">
                <button
                  className="btn-primary-gradient flex-1"
                  onClick={() => {}}
                >
                  Senden
                </button>
                <button
                  className="rounded-md border border-border bg-background px-4 py-2 text-foreground hover:bg-muted"
                  onClick={handleBackToWorkflow}
                >
                  Zurück zum Workflow
                </button>
              </div>
            </div>
          ) : showWorkflow ? (
            <WorkflowVisualization
              isActive={showWorkflow}
              agentRun={agentStatus}
              onComplete={() => {
                // Don't automatically hide workflow, let user choose
              }}
              onShowTemplate={handleShowTemplate}
            />
          ) : agentRunId.current ? (
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  KI-Assistent
                </h3>
              </div>
              <div className="flex-1 overflow-auto">
                <div className="prose prose-sm max-w-none text-foreground">
                  <div className="whitespace-pre-wrap rounded-lg bg-muted/50 p-4">
                    {agentStatus?.steps.map((step) => (
                      <div
                        key={step.id}
                        className="mb-2 border-l-2 border-blue-500/20 p-2"
                      >
                        <div className="text-sm font-medium text-foreground">
                          {step.type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {step.text}
                        </div>
                        <div className="text-xs text-muted-foreground/60">
                          Status: {step.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2 border-t pt-4">
                <button
                  className="btn-primary-gradient flex-1"
                  onClick={() => {
                    if (selectedMail) {
                      handleStartAgent(selectedMail);
                    }
                  }}
                  disabled={isPending}
                >
                  {isPending ? "Wird verarbeitet..." : "Erneut analysieren"}
                </button>
                {agentStatus?.status === "completed" &&
                  agentStatus.draft_body && (
                    <button
                      className="rounded-md border border-border bg-background px-4 py-2 text-foreground hover:bg-muted"
                      onClick={() => setShowWorkflow(true)}
                    >
                      Workflow anzeigen
                    </button>
                  )}
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-4">
              <div className="bg-gradient-accent rounded-full p-4">
                <svg
                  className="h-8 w-8 text-accent-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  KI-Assistent
                </h3>
                <p className="text-sm text-muted-foreground">
                  Intelligente Unterstützung für Ihre Korrespondenz
                </p>
                <div className="pt-2">
                  <button
                    className="btn-primary-gradient"
                    onClick={() => {
                      if (selectedMail) {
                        handleStartAgent(selectedMail);
                      }
                    }}
                    disabled={isPending || !selectedMail}
                  >
                    {isPending ? "Wird verarbeitet..." : "Assistent aktivieren"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
