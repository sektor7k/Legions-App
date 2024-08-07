import DashboardHeader from '@/components/layout/DashboardHeader';
import Sidebar from '@/components/layout/sidebar';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardHeader />
      <>
      <div className="relative flex h-screen overflow-hidden">
        <Sidebar/>
        <main className="flex-1 overflow-y-auto pt-14 relative md:overflow-hidden">
          <div className="fixed inset-0 bg-bg-castrum bg-cover bg-center"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </>
    </>
  );
}
