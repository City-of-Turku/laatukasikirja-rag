"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface HeaderMenuProps {
  authBtn: React.ReactNode;
  useTunnistamo: string | undefined;
  useChangeLog: string | undefined;
  useSourceFiles: string | undefined;
}

export default function HeaderMenu({
  authBtn,
  useTunnistamo,
  useChangeLog,
  useSourceFiles,
}: HeaderMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const anyNavItems = useChangeLog || useTunnistamo || useSourceFiles;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-4">
        {useSourceFiles && (
          <Link href="sourcefiles" className="px-3 py-2 text-center w-full">
            Lähdetiedostot
          </Link>
        )}
        {useChangeLog && (
          <Link href="changelog" className="px-3 py-2 text-center w-full">
            Muutoshistoria
          </Link>
        )}
        {useTunnistamo && authBtn}
      </nav>

      {/* Mobile Menu Toggle */}
      {anyNavItems && (
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
            aria-label="Sivunavigaatio"
            aria-expanded={isMenuOpen ? "true" : "false"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-50 md:hidden">
          <div className="bg-white shadow-lg">
            <nav className="flex flex-col items-center space-y-4 py-4 border-t">
              {useSourceFiles && (
                <Link
                  onClick={toggleMenu}
                  href="sourcefiles"
                  className="px-3 py-2 text-center w-full"
                >
                  Lähdetiedostot
                </Link>
              )}
              {useChangeLog && (
                <Link
                  onClick={toggleMenu}
                  href="changelog"
                  className="px-3 py-2 text-center w-full"
                >
                  Muutoshistoria
                </Link>
              )}
              {useTunnistamo && (
                <div className="w-full flex justify-center">{authBtn}</div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
