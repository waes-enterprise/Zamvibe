import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact ZamVibe",
  description: "Get in touch with the ZamVibe team",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
