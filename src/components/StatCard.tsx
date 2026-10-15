
import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: number;
  note: string;
  icon: ReactNode;
  color: "indigo" | "emerald" | "amber" | "violet";
};

const iconColors: Record<StatCardProps["color"], string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
};

export default function StatCard({
  label,
  value,
  note,
  icon,
  color,
}: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

        <div className={`rounded-xl p-2.5 ${iconColors[color]}`}>
          {icon}
        </div>
      </div>

      <p className="text-3xl font-bold tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {note}
      </p>
    </article>
  );
}
