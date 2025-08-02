import { PagesLayoutComponent } from "./LayoutComponent";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PagesLayoutComponent>{children}</PagesLayoutComponent>;
}
