import { createClient } from "@/lib/supabase-server";
import UsesClient from "./UsesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uses | My Setup",
  description: "The hardware, software, and tools I use for my daily work.",
};

export default async function UsesPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("uses_items")
    .select("*")
    .order("sort_order", { ascending: true });

  return <UsesClient items={items || []} />;
}
