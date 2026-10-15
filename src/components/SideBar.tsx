"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import {
  Activity,
  CalendarDays,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Projects", icon: FolderKanban },
  { label: "My Tasks", icon: ClipboardList },
  { label: "Calendar", icon: CalendarDays },
  { label: "Team", icon: Users },
  { label: "Settings", icon: Settings },
];

type SidebarProps = {
  activeNav: string;
  onNavigate: (label: string) => void;
  mobileMenuOpen: boolean;
  onClose: () => void;
};

export default function SideBar({
  activeNav,
  onNavigate,
  mobileMenuOpen,
  onClose,
}: SidebarProps) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#111827] text-slate-300 transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
              <Activity size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              TaskFlow
            </span>
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map(({ label, icon: Icon }) => {
              const active = activeNav === label;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    onNavigate(label);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-indigo-500/15 text-indigo-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  {label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white">
              JD
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                John Doe
              </p>
              <p className="truncate text-xs text-slate-400">Demo workspace</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
