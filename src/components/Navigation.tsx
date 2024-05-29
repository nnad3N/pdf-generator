"use client";

import {
  LogOutIcon as SignOutIcon,
  FileTextIcon,
  HomeIcon,
  ShieldIcon,
  MoonIcon,
  SunIcon,
  type LucideProps,
} from "lucide-react";

import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type User } from "lucia";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/trpc/react";
import type { MakeRequired } from "@/types";
import clsx from "clsx";

interface Props {
  user: User;
}

type Link = {
  isProtected?: boolean;
  href: "/" | "/templates" | "/admin";
  tooltip: string;
  IconElement: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

const links: Link[] = [
  {
    href: "/",
    tooltip: "Dashboard",
    IconElement: HomeIcon,
  },
  {
    href: "/templates",
    tooltip: "Templates",
    IconElement: FileTextIcon,
  },
  {
    isProtected: true,
    href: "/admin",
    tooltip: "Admin",
    IconElement: ShieldIcon,
  },
];

const Navigation: React.FC<Props> = ({ user }) => {
  const { mutate: signOut } = api.user.signOut.useMutation({
    onSuccess() {
      window.location.reload();
    },
  });

  return (
    <nav className="flex h-full flex-col justify-between gap-y-3 p-5 [&_div]:flex [&_div]:flex-col [&_div]:gap-y-1">
      <div>
        {links.map(({ isProtected, href, tooltip, IconElement }) =>
          isProtected && !user.isAdmin ? null : (
            <NavButton key={href} as="link" tooltip={tooltip} href={href}>
              {<IconElement className="h-5 w-5" />}
            </NavButton>
          ),
        )}
      </div>
      <div>
        <ThemeToggle />
        <NavButton as="button" tooltip="Sign Out" onClick={() => signOut()}>
          <SignOutIcon className="h-5 w-5" />
        </NavButton>
      </div>
    </nav>
  );
};

export default Navigation;

interface BaseNavButtonProps<T extends "link" | "button" | "base"> {
  as: T;
  tooltip: string;
}

type LinkNavButtonProps = MakeRequired<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> &
  BaseNavButtonProps<"link">;

type ButtonNavButtonProps = ButtonProps & BaseNavButtonProps<"button">;

type NavButtonProps = LinkNavButtonProps | ButtonNavButtonProps;

const NavButton: React.FC<React.PropsWithChildren<NavButtonProps>> = ({
  children,
  tooltip,
  className,
  ...props
}) => {
  const pathname = usePathname();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {props.as === "button" ? (
          <Button {...props} className={className} variant="ghost" size="icon">
            {children}
          </Button>
        ) : (
          <Button
            className={clsx(pathname === props.href && "bg-muted", className)}
            variant="ghost"
            size="icon"
            asChild
          >
            {/* Set "as" to undefined to prevent BaseNavButtonProps["as"] from changing the href */}
            <Link {...props} as={undefined}>
              {children}
            </Link>
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};

const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <SunIcon className="h-5 w-5 dark:hidden" />
              <MoonIcon className="absolute hidden h-5 w-5 dark:block" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          Toggle Theme
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side="top" align="start">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
