import { chatModels, getActiveModels, getCapabilities } from "@/lib/ai/models";

export async function GET() {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  };

  try {
    const capabilities = await getCapabilities();
    const activeModels = getActiveModels();

    return Response.json(
      {
        models: chatModels,
        capabilities,
        activeModels,
      },
      { headers }
    );
  } catch (error) {
    console.error("Error fetching models:", error);
    return Response.json(
      { error: "Failed to fetch models" },
      { status: 500, headers }
    );
  }
}
