"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileStack,
  Images,
  NotebookPen,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardView = "dashboard" | "pages" | "media" | "blog" | "settings";

type SidebarProps = {
  activeView: DashboardView;
  collapsed: boolean;
  onViewChange: (view: DashboardView) => void;
  onToggle: () => void;
};

const items: Array<{
  id: DashboardView;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "pages", label: "Pagini", icon: FileStack },
  { id: "media", label: "Media", icon: Images },
  { id: "blog", label: "Blog", icon: NotebookPen },
  { id: "settings", label: "Setări", icon: Settings },
];

export function Sidebar({ activeView, collapsed, onViewChange, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "relative hidden h-full border-r border-white/5 bg-slate-950/80 px-4 py-6 backdrop-blur-xl lg:flex lg:flex-col",
        collapsed ? "w-[88px]" : "w-64",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#1f2f3d] text-[#6d808b] transition hover:border-[#66fcf1]/60 hover:text-[#66fcf1]"
      >
        {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </button>

      <div className={cn("mb-8 px-2", collapsed && "px-0 text-center")}>
        <p className="text-[1.75rem] font-semibold leading-none tracking-tight text-[#66fcf1]">
          {collapsed ? "DD" : "Digital Dot"}
        </p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewChange(item.id)}
              className={cn(
                "group relative flex h-11 w-full items-center gap-3 rounded-full px-4 text-sm text-slate-400 transition",
                active ? "text-[#66fcf1]" : "hover:bg-white/5 hover:text-white",
                collapsed && "justify-center px-0",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-full bg-cyan-400/10"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              ) : null}
              <Icon className="relative z-10 h-4 w-4" />
              {!collapsed ? <span className="relative z-10 font-medium">{item.label}</span> : null}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className="mt-auto rounded-full border border-cyan-400/20 bg-cyan-400/10 py-3 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#66fcf1] transition hover:bg-cyan-400/20"
      >
        {collapsed ? "NEW" : "NEW PROJECT"}
      </button>
    </aside>
  );
}
