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
      <div className="relative flex h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto pt-14 relative">
          <div className="fixed inset-0 bg-bg-castrum bg-cover bg-center"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
