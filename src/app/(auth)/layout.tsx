export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-screen overflow-hidden">
      <main className="flex-1 overflow-y-auto relative">
        {/* Arka plan videosu */}
        <div className="fixed inset-0">
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          >
            <source src="/auth.mp4" type="video/mp4" />
            Video error
          </video>
        </div>
        {/* İçerik */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
