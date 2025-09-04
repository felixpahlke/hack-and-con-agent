import { createFileRoute } from "@tanstack/react-router";
import { MailLayout } from "@/components/mail/MailLayout";

export const Route = createFileRoute("/_layout/mail")({
  component: Mail,
});

function Mail() {
  return <MailLayout />;
}
