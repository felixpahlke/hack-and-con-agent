import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, AlertCircle, Paperclip, Clock } from "lucide-react";
import { Mail } from "./types";
import { mockMails } from "./mockData";
import { cn } from "@/lib/utils";

interface MailListProps {
  selectedMailId?: string;
  onMailSelect: (mail: Mail) => void;
}

export function MailList({ selectedMailId, onMailSelect }: MailListProps) {
  const [mails] = useState<Mail[]>(mockMails);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffDays <= 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="nav-gradient border-b p-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Posteingang</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {mails.filter((mail) => !mail.read).length} ungelesene Nachrichten
            </p>
            <div className="badge-info">{mails.length} Total</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {mails.map((mail, index) => (
          <div key={mail.id}>
            <div
              className={cn(
                "table-row-hover cursor-pointer border-b border-border/30 transition-all duration-300",
                selectedMailId === mail.id && "bg-gradient-secondary shadow-sm",
                !mail.read &&
                  "bg-gradient-accent/5 border-l-4 border-l-primary/50",
              )}
              onClick={() => onMailSelect(mail)}
            >
              <div className="p-4 transition-all duration-300 hover:px-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-border/20 transition-all duration-300 hover:ring-primary/30">
                    <AvatarFallback className="bg-gradient-primary text-xs font-medium text-primary-foreground">
                      {getInitials(mail.sender)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "truncate text-sm",
                          !mail.read && "font-semibold",
                        )}
                      >
                        {mail.sender}
                      </p>
                      <div className="flex flex-shrink-0 items-center gap-1">
                        {mail.starred && (
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        )}
                        {mail.important && (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                        {mail.attachments && mail.attachments.length > 0 && (
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    <p
                      className={cn(
                        "truncate text-sm",
                        !mail.read && "font-medium",
                      )}
                    >
                      {mail.subject}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {mail.preview}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {mail.labels.map((label) => (
                          <div
                            key={label}
                            className={cn(
                              "badge-info transition-all duration-200 hover:scale-105",
                              label === "Urgent" && "badge-warning",
                              label === "Important" && "badge-success",
                            )}
                          >
                            {label}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(mail.date)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {index < mails.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  );
}
