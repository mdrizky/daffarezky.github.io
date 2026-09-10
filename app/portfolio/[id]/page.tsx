import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function LegacyProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("slug, id, is_published")
    .or(`id.eq.${id},slug.eq.${id}`)
    .maybeSingle();

  if (!data || data.is_published === false) notFound();
  redirect(`/projects/${data.slug || data.id}`);
}
