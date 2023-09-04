"use client";

import { Menu } from "@headlessui/react";
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ComputerDesktopIcon,
  KeyIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/20/solid";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, Children, useEffect } from "react";

const Navigation = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const isNavOpen = localStorage.getItem("isNavOpen");

    if (isNavOpen === null) {
      localStorage.setItem("isNavOpen", "true");
      return;
    }

    setIsNavOpen(JSON.parse(isNavOpen) as boolean);
  }, []);

  if (!isMounted) return null;

  const handleToggleNav = () => {
    setIsNavOpen((isNavOpen) => !isNavOpen);
    localStorage.setItem("isNavOpen", JSON.stringify(!isNavOpen));
  };

  return (
    <nav
      className={`flex h-full justify-between gap-y-3 [&_div]:flex [&_div]:flex-col [&_div]:gap-y-3 ${
        isNavOpen ? "w-64" : "w-max"
      } flex-col bg-base-200 p-5`}
    >
      <div>
        <button onClick={handleToggleNav} className="btn btn-square btn-ghost">
          <Bars3Icon className="h-7 w-7" />
        </button>
        <NavButton variant="link" isNavOpen={isNavOpen} href="/">
          <KeyIcon className="h-6 w-6" />
          Admin Panel
        </NavButton>
        <NavButton variant="link" isNavOpen={isNavOpen} href="/admin">
          <KeyIcon className="h-6 w-6" />
          Admin Panel
        </NavButton>
      </div>
      <div>
        <ThemeControl isNavOpen={isNavOpen} />
        <NavButton
          variant="button"
          isNavOpen={isNavOpen}
          onClick={() => console.log("sign out")}
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          Sign Out
        </NavButton>
      </div>
    </nav>
  );
};

export default Navigation;

interface BaseNavButtonProps<T extends "link" | "button" | "menu-button"> {
  variant: T;
  isNavOpen: boolean;
}

interface LinkNavButtonProps extends BaseNavButtonProps<"link"> {
  href: string;
}

interface ButtonNavButtonProps extends BaseNavButtonProps<"button"> {
  onClick: () => void;
}

type NavButtonProps =
  | LinkNavButtonProps
  | ButtonNavButtonProps
  | BaseNavButtonProps<"menu-button">;

const NavButton: React.FC<React.PropsWithChildren<NavButtonProps>> = (
  props,
) => {
  const pathname = usePathname();
  const iconChild = Children.toArray(props.children)[0];
  const dynamicChildren = props.isNavOpen ? props.children : iconChild;

  switch (props.variant) {
    case "link":
      const isActive = pathname === props.href;

      return (
        <Link
          className={`btn ${isActive ? "btn-neutral" : "btn-ghost"} ${
            props.isNavOpen ? "btn-block justify-start gap-x-5" : "btn-square"
          }`}
          href={props.href}
        >
          {dynamicChildren}
        </Link>
      );
    case "button":
      return (
        <button
          className={`btn btn-ghost ${
            props.isNavOpen ? "btn-block justify-start gap-x-5" : "btn-square"
          }`}
          onClick={props.onClick}
        >
          {dynamicChildren}
        </button>
      );
    case "menu-button":
      return (
        <Menu.Button
          className={`btn btn-ghost ${
            props.isNavOpen ? "btn-block justify-start gap-x-5" : "btn-square"
          }`}
        >
          {dynamicChildren}
        </Menu.Button>
      );
    default:
      return null;
  }
};

type ThemeOptions = "light" | "dark" | "system";

interface GetThemeIcon {
  theme: ThemeOptions;
  size?: "small" | "base";
}

const getThemeIcon = ({ theme, size = "small" }: GetThemeIcon) => {
  const className = size === "small" ? "h-4 w-4" : "h-6 w-6";

  switch (theme) {
    case "light":
      return <SunIcon className={className} />;
    case "dark":
      return <MoonIcon className={className} />;
    case "system":
      return <ComputerDesktopIcon className={className} />;
  }
};

const themeControlButtons: {
  theme: ThemeOptions;
  icon: React.ReactNode;
}[] = [
  {
    theme: "light",
    icon: getThemeIcon({ theme: "light" }),
  },
  {
    theme: "dark",
    icon: getThemeIcon({ theme: "dark" }),
  },
  {
    theme: "system",
    icon: getThemeIcon({ theme: "system" }),
  },
];

interface ThemeControlProps {
  isNavOpen: boolean;
}

const ThemeControl: React.FC<ThemeControlProps> = ({ isNavOpen }) => {
  const { theme, setTheme } = useTheme();

  return (
    <Menu className="relative" as="div">
      <NavButton variant="menu-button" isNavOpen={isNavOpen}>
        {getThemeIcon({ theme: theme as ThemeOptions, size: "base" })} Theme
      </NavButton>
      <Menu.Items
        as="ul"
        className="menu rounded-box absolute -top-3 w-44 -translate-y-full bg-base-300 p-2 shadow-md"
      >
        {themeControlButtons.map((control) => (
          <Menu.Item
            disabled={theme === control.theme}
            as="li"
            key={control.theme}
          >
            <button
              className="capitalize ui-active:bg-base-content ui-active:bg-opacity-10 ui-disabled:pointer-events-none ui-disabled:opacity-25"
              onClick={() => setTheme(control.theme)}
            >
              {control.icon} {control.theme}
            </button>
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};
