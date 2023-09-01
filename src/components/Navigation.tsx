"use client";

import { Bars3Icon, KeyIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useEffect, useState, Children } from "react";

const Navigation = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);

  useEffect(() => {
    const isNavOpen = localStorage.getItem("isNavOpen");

    if (isNavOpen !== null) {
      setIsNavOpen(JSON.parse(isNavOpen) as boolean);
    }
  }, []);

  const handleToggleNav = () => {
    setIsNavOpen((isOpen) => !isOpen);
    localStorage.setItem("isNavOpen", JSON.stringify(!isNavOpen));
  };

  return (
    <nav
      className={`flex h-full ${
        isNavOpen ? "w-60" : "w-max"
      } flex-col gap-y-3 bg-base-300 p-5`}
    >
      <button onClick={handleToggleNav} className="btn btn-square btn-ghost">
        <Bars3Icon className="h-7 w-7" />
      </button>
      <NavLink isNavOpen={isNavOpen} href="/">
        <KeyIcon className="h-6 w-6" />
        Admin Panel
      </NavLink>
      <NavLink isNavOpen={isNavOpen} href="/test">
        <KeyIcon className="h-6 w-6" />
        Admin Panel
      </NavLink>
    </nav>
  );
};

interface NavLinkProps {
  href?: string;
  onClick?: () => void;
  isNavOpen: boolean;
}

const NavLink: React.FC<React.PropsWithChildren<NavLinkProps>> = ({
  href,
  onClick,
  isNavOpen,
  children,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const iconChild = Children.toArray(children)[0];
  const dynamicChildren = isNavOpen ? children : iconChild;

  return href ? (
    <Link
      className={`btn ${isActive ? "btn-neutral" : "btn-ghost"} ${
        isNavOpen ? "w-full justify-between" : "btn-square"
      }`}
      href={href}
    >
      {dynamicChildren}
    </Link>
  ) : (
    <button
      className={`btn btn-ghost ${
        isNavOpen ? "w-full justify-between" : "btn-square"
      }`}
      onClick={onClick}
    >
      {dynamicChildren}
    </button>
  );
};

export default Navigation;
