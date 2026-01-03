import { redirect } from "next/navigation";

export default function LangPage({ params }) {
  redirect(`/${params.lang}/login`);
}
