import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MailList } from "./MailList";
import { MailDetail } from "./MailDetail";
import { Mail } from "./types";

export function MailLayout() {
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);

  const handleMailSelect = (mail: Mail) => {
    setSelectedMail(mail);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] w-full gap-4">
      {/* Left Panel - Mail List */}
      <Card className="flex w-1/3 min-w-[400px] flex-col">
        <MailList
          selectedMailId={selectedMail?.id}
          onMailSelect={handleMailSelect}
        />
      </Card>

      {/* Right Side - Two Panels */}
      <div className="flex flex-1 gap-4">
        {/* Left Right Panel - Mail Content */}
        <Card className="flex-1">
          <MailDetail mail={selectedMail} />
        </Card>

        {/* Right Right Panel */}
        <Card className="flex-1 p-6">
          <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-muted">
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-medium text-muted-foreground">
                Right Right Panel
              </h3>
              <p className="text-sm text-muted-foreground">
                This panel is ready for your content
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
