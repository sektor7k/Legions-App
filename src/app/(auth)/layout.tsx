export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return  <>
    <div className="relative flex h-screen overflow-hidden">
      <main className="flex-1 overflow-y-auto relative">
        <div className="fixed inset-0 bg-bg-auth bg-cover bg-center"></div>
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  </>
  } 