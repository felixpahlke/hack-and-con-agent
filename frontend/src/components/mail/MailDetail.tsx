import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, AlertCircle, Paperclip, Clock } from "lucide-react";
import { Mail } from "./types";

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
      <div className="flex h-full items-center justify-center p-6">
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-medium text-muted-foreground">
            Select a mail to view
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose a mail from the list to see its content here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Mail Header */}
      <div className="border-b p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-xl font-semibold leading-tight">
              {mail.subject}
            </h1>
            <div className="flex items-center gap-2">
              {mail.starred && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
              {mail.important && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{getInitials(mail.sender)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{mail.sender}</p>
                <p className="text-sm text-muted-foreground">
                  &lt;{mail.senderEmail}&gt;
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDate(mail.date)}
              </div>
            </div>
          </div>

          {mail.labels.length > 0 && (
            <div className="flex gap-2">
              {mail.labels.map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
          )}

          {mail.attachments && mail.attachments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Attachments
              </p>
              <div className="flex flex-wrap gap-2">
                {mail.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-md border p-2"
                  >
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{attachment.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({attachment.size})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mail Body */}
      <div className="flex-1 overflow-auto p-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {mail.body}
          </pre>
        </div>
      </div>
    </div>
  );
}
