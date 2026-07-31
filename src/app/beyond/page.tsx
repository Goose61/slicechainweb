import { redirect } from "next/navigation";
import { beyondTheSwipePath } from "@/content/beyond-content";

export default function BeyondRedirectPage() {
  redirect(beyondTheSwipePath);
}
