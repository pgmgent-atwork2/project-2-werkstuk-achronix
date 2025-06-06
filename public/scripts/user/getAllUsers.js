export default async function getAllUsers() {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Fout bij het ophalen van gebruikers");
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Fout bij het ophalen van gebruikers:", error);
    return [];
  }
}
