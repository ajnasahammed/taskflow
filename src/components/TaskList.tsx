
import { Check, Circle, Search, Pencil, Trash2 } from "lucide-react";

import type { Priority, Task } from "@/lib/dashboard-types";

type TaskListProps = {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
};

const priorityStyles: Record<Priority, string> = {
  High: "bg-rose-50 text-rose-600 ring-rose-100",
  Medium: "bg-amber-50 text-amber-700 ring-amber-100",
  Low: "bg-sky-50 text-sky-700 ring-sky-100",
};

export default function TaskList({
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}: TaskListProps) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Recent Tasks</h2>
          <p className="mt-1 text-sm text-slate-500">
            Your latest work at a glance
          </p>
        </div>

        <span className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
          {tasks.length} tasks
        </span>
      </div>

      <div className="space-y-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-start gap-3 border-b border-slate-100 py-4 last:border-0 sm:items-center"
          >
            <button
              type="button"
              onClick={() => onToggleTask(task.id)}
              aria-label={`Mark ${task.title} ${
                task.status === "Completed" ? "incomplete" : "complete"
              }`}
              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition sm:mt-0 ${
                task.status === "Completed"
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-300 text-transparent hover:border-indigo-500"
              }`}
            >
              {task.status === "Completed" ? (
                <Check size={13} strokeWidth={3} />
              ) : (
                <Circle size={12} />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <p
                className={`wrap-break-word text-sm font-semibold ${
                  task.status === "Completed"
                    ? "text-slate-400 line-through"
                    : "text-slate-800"
                }`}
              >
                {task.title}
              </p>

              <p className="mt-1 truncate text-xs text-slate-500">
                {task.project}
              </p>

              <p className="mt-2 text-xs text-slate-400 sm:hidden">
                Due: {task.due}
              </p>
            </div>

            <span
              className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset sm:inline-flex ${
                priorityStyles[task.priority]
              }`}
            >
              {task.priority}
            </span>

            <span className="hidden w-16 shrink-0 text-right text-xs text-slate-500 lg:block">
              {task.due}
            </span>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => onEditTask(task)}
                aria-label={`Edit ${task.title}`}
                title="Edit task"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Pencil size={16} />
              </button>

              <button
                type="button"
                onClick={() => onDeleteTask(task)}
                aria-label={`Delete ${task.title}`}
                title="Delete task"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="py-12 text-center">
            <Search size={28} className="mx-auto mb-3 text-slate-300" />
            <p className="font-medium text-slate-700">No matching tasks</p>
            <p className="mt-1 text-sm text-slate-500">
              Try another search term.
            </p>
          </div>
        )}
      </div>

      <p className="mt-5 text-xs leading-5 text-slate-400">
        Use the circle to change completion status, or the pencil and trash
        icons to edit or delete a task.
      </p>
    </section>
  );
}
