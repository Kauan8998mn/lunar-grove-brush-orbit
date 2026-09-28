import { createFileRoute } from "@tanstack/react-router";
import { VerdantApp } from "@/components/verdant-app";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    join: typeof search.join === "string" ? search.join : undefined,
  }),
  component: Home,
});

function Home() {
  const { join } = Route.useSearch();
  return <VerdantApp invite={join} />;
}
