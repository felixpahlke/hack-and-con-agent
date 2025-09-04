import { useState } from "react";
import { MailList } from "./MailList";
import { MailDetail } from "./MailDetail";
import { Mail } from "./types";
import { useMutation } from "@tanstack/react-query";
import { AgentService } from "@/client/services";

export function MailLayout() {
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);

  const handleMailSelect = (mail: Mail) => {
    setSelectedMail(mail);
  };

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
  });

  console.log(agentResponse?.message);

  return (
    <div className="flex h-[calc(100vh-120px)] w-full gap-6 p-2">
      {/* Left Panel - Mail List */}
      <div className="card-gradient flex w-1/3 min-w-[400px] flex-col overflow-hidden">
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
          {agentResponse?.message ? (
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
                    {agentResponse.message}
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                <button
                  className="btn-primary-gradient"
                  onClick={() => {
                    if (selectedMail) {
                      startAgent(selectedMail);
                    }
                  }}
                  disabled={isPending}
                >
                  {isPending ? "Wird verarbeitet..." : "Erneut analysieren"}
                </button>
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
                        startAgent(selectedMail);
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
