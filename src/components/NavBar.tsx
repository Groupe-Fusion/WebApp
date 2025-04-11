import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react'
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "", icon: "/maison-bleu-1.png", alt: "Maison bleu", label: "Accueil", active: true },
    { href: "", icon: "/document-signe-1.png", alt: "Document signe", label: "Mes demandes", active: false },
    { href: "", icon: "/commentaire-alt-points-1.png", alt: "Commentaire alt", label: "Messages", active: false },
    { href: "", icon: "/utilisateur-1.png", alt: "Utilisateur", label: "Profil", active: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-xl font-extrabold text-primary font-century">QuickServe</span>
      </div>

      <NavigationMenu.Root className="hidden sm:block">
        <NavigationMenu.List className="flex items-center gap-6">
          {navItems.map((item) => (
            <NavigationMenu.Item key={item.href}>
              <NavigationMenu.Link asChild>
                <Link to={item.href} className="flex flex-col items-center cursor-pointer hover:text-secondary">
                  <img
                    className="w-[25px] h-[25px] object-cover mb-1"
                    alt={item.alt}
                    src={item.icon}
                  />
                  <span
                    className={`text-sm text-center ${item.active ? "font-semibold text-[#2554f8]" : "font-normal text-black"}`}
                  >
                    {item.label}
                  </span>
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
          <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
              <button 
                onClick={() => alert("Notifications clicked")} 
                className="flex flex-col items-center cursor-pointer hover:text-secondary bg-transparent border-none"
              >
                <img
                  className="w-[25px] h-[25px] object-cover mb-1"
                  alt="Cloche"
                  src="/cloche-1.png"
                />
                <span
                  className="text-sm text-center font-normal text-black"
                >
                  Notifications
                </span>
              </button>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
      <div className="md:hidden">
        <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <Dialog.Trigger asChild>
            <button
              className="p-2 text-primary rounded-md hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Dialog.Content className="fixed right-0 top-0 h-full w-[375px] bg-white p-4 shadow-lg z-50 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-xl font-bold text-primary font-century">Index DM Durable</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </div>
              <nav className="flex flex-col">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="py-2 hover:bg-gray-100 rounded text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
