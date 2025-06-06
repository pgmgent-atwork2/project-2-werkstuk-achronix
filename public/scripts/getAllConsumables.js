export default async function getAllConsumables() {
  try {
    const response = await fetch("/api/consumables");
    if (!response.ok) {
      throw new Error("Fout bij het ophalen van producten");
    }
    const consumables = await response.json();
    return consumables;
  } catch (error) {
    console.error("Fout bij het ophalen van producten:", error);
    return [];
  }
}
