import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ZamVibe",
  description:
    "Learn about ZamVibe — Africa's #1 entertainment hub for music, celebrity gossip, and viral stories.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
