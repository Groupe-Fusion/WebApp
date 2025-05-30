import { PropsWithChildren } from "react";
import { Navbar } from "../../components/NavBar";

export default function Layout({ children }: Readonly<PropsWithChildren<{}>>) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="bg-white shadow-xs fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>
      <main className="max-w-7xl mx-auto mt-20 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
