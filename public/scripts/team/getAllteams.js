export default async function getAllTeams() {
  const response = await fetch("/api/teams", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch teams");
  }
  const teams = await response.json();

  return teams;
}
