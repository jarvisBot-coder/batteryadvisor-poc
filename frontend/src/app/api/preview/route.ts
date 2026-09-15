import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const url = searchParams.get("url");
  const status = searchParams.get("status");

  // Validate the preview secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  // Enable or disable draft mode based on content status
  const draft = await draftMode();
  if (status === "published") {
    draft.disable();
  } else {
    draft.enable();
  }

  // Redirect to the content page
  redirect(url || "/");
}
