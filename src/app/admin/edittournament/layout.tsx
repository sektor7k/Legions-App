

export default function DashboardLayout({
    children
  }: {
    children: React.ReactNode;
  }) {
    return (
      <>
        <div className="relative flex h-screen overflow-hidden ">
          <main className="flex-1 pt-16 relative overflow-y-hidden ">
            <div className="fixed inset-0 bg-bg-castrum bg-cover bg-center h-full"></div>
            <div className="relative z-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </>
    );
  }
  