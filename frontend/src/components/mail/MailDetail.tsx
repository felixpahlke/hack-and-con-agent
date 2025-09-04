import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, AlertCircle, Paperclip, Clock } from "lucide-react";
import { Mail } from "./types";
import { cn } from "@/lib/utils";

interface MailDetailProps {
  mail: Mail | null;
}

export function MailDetail({ mail }: MailDetailProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!mail) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="space-y-4 text-center">
          <div className="bg-gradient-secondary mx-auto w-fit rounded-full p-6">
            <svg
              className="h-12 w-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              E-Mail auswählen
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Wählen Sie eine E-Mail aus der Liste aus, um den Inhalt hier
              anzuzeigen
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Mail Header */}
      <div className="nav-gradient border-b p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold leading-tight text-foreground">
              {mail.subject}
            </h1>
            <div className="flex items-center gap-3">
              {mail.starred && (
                <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/30">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                </div>
              )}
              {mail.important && (
                <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-border/30">
              <AvatarFallback className="bg-gradient-primary font-semibold text-primary-foreground">
                {getInitials(mail.sender)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <p className="text-lg font-semibold text-foreground">
                  {mail.sender}
                </p>
                <p className="rounded bg-muted/50 px-2 py-1 text-sm text-muted-foreground">
                  {mail.senderEmail}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="bg-gradient-secondary rounded-full p-1">
                  <Clock className="h-3 w-3" />
                </div>
                <span className="font-medium">{formatDate(mail.date)}</span>
              </div>
            </div>
          </div>

          {mail.labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
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
          )}

          {mail.attachments && mail.attachments.length > 0 && (
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Paperclip className="h-4 w-4" />
                Anhänge ({mail.attachments.length})
              </p>
              <div className="flex flex-wrap gap-3">
                {mail.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="card-gradient flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all duration-200 hover:scale-105"
                  >
                    <div className="bg-gradient-accent rounded p-2">
                      <Paperclip className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-foreground">
                        {attachment.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {attachment.size}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mail Body */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-gradient-secondary/30 rounded-lg p-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {mail.body}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 border-t border-border/30 pt-4">
          <button className="btn-primary-gradient">Antworten</button>
          <button className="btn-secondary-gradient">Weiterleiten</button>
          <button className="btn-secondary-gradient">Archivieren</button>
        </div>
      </div>
    </div>
  );
}
