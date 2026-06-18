import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";
import {
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Code2,
  LayoutDashboard,
  LucideIcon,
  Microscope,
  PanelsTopLeft,
  Users
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/today", label: "Today", icon: CalendarCheck },
  { href: "/tasks", label: "Calendar", icon: CalendarDays },
  { href: "/website", label: "Website Planning", icon: PanelsTopLeft },
  { href: "/collaborator", label: "Collaborator", icon: Users },
  { href: "/wix", label: "Wix Learning", icon: BookOpen },
  { href: "/research", label: "Evidence", icon: Microscope },
  { href: "/vibe-coding", label: "Vibe Coding", icon: Code2 },
  { href: "/wix-development", label: "Wix Development", icon: PanelsTopLeft }
];

const isActivePath = (href: string, pathname: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
};

type LayoutProps = PropsWithChildren<{
  title: string;
}>;

export function Layout({ title, children }: LayoutProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{`${title} | FocusFlow`}</title>
        <meta name="description" content="FocusFlow Project Building Space" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-[#f7faf8] text-slate-950">
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-200 bg-[#fbfdfc] px-5 py-6 lg:flex lg:flex-col">
          <Link href="/" className="mb-8 block rounded-md focus:outline-none focus:ring-4 focus:ring-brand-100">
            <div className="text-sm font-semibold text-brand-600">FocusFlow</div>
            <div className="mt-1 text-2xl font-bold text-slate-950">Project Building Space</div>
          </Link>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(item.href, router.pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <div className="text-xs font-semibold text-emerald-700">Next Build Move</div>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
              Pick one concrete action, finish it, then update the roadmap.
            </p>
          </div>
        </aside>

        <div className="lg:pl-72">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
            <Link href="/" className="font-bold text-slate-950">
              FocusFlow
            </Link>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(item.href, router.pathname);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold ${
                      active ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </>
  );
}
