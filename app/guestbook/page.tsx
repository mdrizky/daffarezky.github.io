import GuestbookClient from "./GuestbookClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guestbook | Buku Tamu",
  description: "Leave a message or just say hi on my digital guestbook.",
};

export default function GuestbookPage() {
  return <GuestbookClient />;
}
