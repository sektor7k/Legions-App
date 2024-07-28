import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden bg-bg-castrum bg-cover bg-center">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-14">{children}</main>
      </div>
    </>
  );
}
