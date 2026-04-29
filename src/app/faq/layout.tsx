import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & FAQ",
  description: "Frequently asked questions about ZamVibe",
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
