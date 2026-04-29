import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ZamVibe handles your data and privacy",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
