import { ArrowDownRight, ArrowRight, FolderKanban } from "lucide-react";

export type Project = {
  name: string;
  tasks: number;
  completed: number;
  color: "violet" | "blue" | "emerald";
};

type ProjectProgressProps = {
  projects: Project[];
};

const colorStyles: Record<Project["color"], string> = {
  violet: "bg-violet-100 text-violet-600",
  blue: "bg-blue-100 text-blue-600",
  emerald: "bg-emerald-100 text-emerald-600",
};

const progressStyles: Record<Project["color"], string> = {
  violet: "bg-violet-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
};

export default function ProjectProgress({ projects }: ProjectProgressProps) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Your Projects</h2>
          <p className="mt-1 text-sm text-slate-500">
            Progress across your work
          </p>
        </div>
        <ArrowRight size={19} className="text-slate-400" />
      </div>

      <div className="space-y-6">
        {projects.map((project) => {
          const percentage =
            project.tasks > 0
              ? Math.round((project.completed / project.tasks) * 100)
              : 0;

          return (
            <article key={project.name}>
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorStyles[project.color]}`}
                >
                  <FolderKanban size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {project.completed} of {project.tasks} tasks completed
                  </p>
                </div>

                <span className="text-sm font-bold text-slate-700">
                  {percentage}%
                </span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label={`${project.name} progress`}
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ${progressStyles[project.color]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl bg-indigo-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-indigo-700">
          <ArrowDownRight size={19} />
          <p className="text-sm font-semibold">Keep the momentum</p>
        </div>
        <p className="text-sm leading-6 text-indigo-900/70">
          Small steps every day add up. Finish one task and keep your projects
          moving forward.
        </p>
      </div>
    </section>
  );
}
