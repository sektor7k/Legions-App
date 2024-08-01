export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <section className="min-h-screen flex justify-center items-center bg-bg-auth bg-cover bg-center ">{children}</section>
  }