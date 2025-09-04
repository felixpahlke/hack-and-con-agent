import { createFileRoute, redirect } from "@tanstack/react-router";

import useAuth from "../../hooks/useAuth";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
  beforeLoad: async () => {
    throw redirect({
      to: "/mail",
    });
  },
});

function Dashboard() {
  const { user: currentUser } = useAuth();

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl">
        Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
      </h2>
      <p>Welcome back, nice to see you again!</p>
    </div>
  );
}
