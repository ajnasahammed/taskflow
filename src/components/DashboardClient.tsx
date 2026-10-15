"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock3,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

{
  /*Component Import*/
}
import StatCard from "@/components/StatCard";
import SideBar from "@/components/SideBar";
import type { Project, Task, ProjectOption } from "@/lib/dashboard-types";
import TaskList from "./TaskList";
import ProjectProgress from "./ProjectProgress";
import {
  setTaskCompletion,
  createTask,
  createProject,
  updateTask,
  deleteTask,
  deleteProject,
} from "@/app/actions";
import { RealTimeDateDisplay } from "./RealTimeDateDisplay";

type DashboardClientProps = {
  initialTasks: Task[];
  projects: Project[];
  projectOptions: ProjectOption[];
  userName:string;
};

export default function DashboardClient({
  initialTasks,
  projects,
  projectOptions,
  userName
}: DashboardClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(
    projectOptions[0]?.id ?? "",
  );
  const [taskPriority, setTaskPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(
    "MEDIUM",
  );
  const [dueDate, setDueDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isProjectSaving, setIsProjectSaving] = useState(false);
  const [projectFormError, setProjectFormError] = useState("");

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        task.project.toLowerCase().includes(query);

      const matchesNavigation =
        activeNav !== "My Tasks" || task.status !== "Completed";

      return matchesSearch && matchesNavigation;
    });
  }, [tasks, search, activeNav]);



  const completedCount = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "In Progress",
  ).length;

  async function toggleTask(id: string) {
    const currentTask = tasks.find((task) => task.id === id);

    if (!currentTask) return;

    const completed = currentTask.status !== "Completed";

    try {
      const result = await setTaskCompletion(id, completed);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === result.id
            ? {
                ...task,
                status:
                  result.status === "COMPLETED"
                    ? "Completed"
                    : result.status === "IN_PROGRESS"
                      ? "In Progress"
                      : "Todo",
              }
            : task,
        ),
      );
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Couldn't save the task status. Please try again.");
    }
  }

  async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!taskTitle.trim()) {
      setFormError("Please enter a task title.");
      return;
    }

    if (!selectedProjectId) {
      setFormError("Please select a project.");
      return;
    }

    setIsSaving(true);

    try {
      if (editingTask) {
        await updateTask({
          id: editingTask.id,
          title: taskTitle.trim(),
          projectId: selectedProjectId,
          priority: taskPriority,
          dueDate,
        });
      } else {
        await createTask({
          title: taskTitle.trim(),
          projectId: selectedProjectId,
          priority: taskPriority,
          dueDate,
        });
      }

      setIsTaskFormOpen(false);
      setEditingTask(null);
      router.refresh();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to save the task. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function addTask() {
    setEditingTask(null);
    setTaskTitle("");
    setSelectedProjectId(projectOptions[0]?.id ?? "");
    setTaskPriority("MEDIUM");
    setDueDate("");
    setFormError("");
    setIsTaskFormOpen(true);
  }

  async function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProjectFormError("");

    const name = projectName.trim();

    if (!name) {
      setProjectFormError("Please enter a project name.");
      return;
    }

    setIsProjectSaving(true);

    try {
      const project = await createProject({ name });

      setProjectName("");
      setIsProjectFormOpen(false);
      setSelectedProjectId(project.id);

      router.refresh();
    } catch (error) {
      setProjectFormError(
        error instanceof Error
          ? error.message
          : "Unable to create the project. Please try again.",
      );
    } finally {
      setIsProjectSaving(false);
    }
  }

  function handleEditTask(task: Task) {
    setTaskTitle(task.title);
    setSelectedProjectId(task.projectId ?? "");
    setTaskPriority(task.priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH");
    setDueDate(task.dueDate ?? "");
    setFormError("");
    setEditingTask(task);
    setIsTaskFormOpen(true);
  }

  async function handleDeleteTask(task: Task) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setIsDeletingTask(true);

    try {
      await deleteTask(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Unable to delete this task.",
      );
    } finally {
      setIsDeletingTask(false);
    }
  }

  async function handleDeleteProject(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.name}" and all ${project.tasks} task(s) assigned to it? This cannot be undone.`,
    );

    if (!confirmed) return;

    setIsDeletingProject(true);

    try {
      await deleteProject(project.id);
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete the project.",
      );
    } finally {
      setIsDeletingProject(false);
    }
  }


  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <div className="flex min-h-screen">
        {/* Mobile backdrop */}
        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          >
            <Menu size={22} />
          </button>
        )}

        {/* SideBar */}
        <SideBar
          activeNav={activeNav}
          onNavigate={setActiveNav}
          mobileMenuOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur sm:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"
              >
                <Menu size={22} />
              </button>

              <div className="relative w-full max-w-md">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tasks and projects..."
                  aria-label="Search tasks and projects"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <div className="ml-3 flex items-center gap-3 sm:gap-5">
              <button
                type="button"
                aria-label="Notifications"
                className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <Bell size={20} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
              <div className="hidden h-8 w-px bg-slate-200 sm:block" />
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                JD
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1600px] p-4 sm:p-8">
            {/* Welcome */}
            <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="mb-2 text-sm font-medium text-indigo-600">
                  <RealTimeDateDisplay/>
                </p>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Good morning, {userName || "There"} 👋
                </h1>
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Here&apos;s what&apos;s happening with your projects today.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProjectName("");
                    setProjectFormError("");
                    setIsProjectFormOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <FolderKanban size={18} />
                  New Project
                </button>

                <button
                  type="button"
                  onClick={addTask}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.98]"
                >
                  <Plus size={18} />
                  New Task
                </button>
              </div>
            </section>

            {/* Statistics */}
            <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Projects"
                value={projects.length}
                note="Across your workspace"
                icon={<FolderKanban size={21} />}
                color="indigo"
              />

              <StatCard
                label="Total Tasks"
                value={tasks.length}
                note="All tracked tasks"
                icon={<ClipboardList size={21} />}
                color="emerald"
              />

              <StatCard
                label="In Progress"
                value={inProgressCount}
                note="Currently underway"
                icon={<Clock3 size={21} />}
                color="amber"
              />

              <StatCard
                label="Completed"
                value={completedCount}
                note="Nicely done!"
                icon={<CheckCircle2 size={21} />}
                color="violet"
              />
            </section>

            {/* Dashboard columns */}
            <div className="grid grid-cols-1 items-start gap-6 2xl:grid-cols-[1.5fr_1fr]">
              {/* Tasks */}
              <TaskList
                tasks={visibleTasks}
                onToggleTask={toggleTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />

              {/* Projects */}
              <ProjectProgress
                projects={projects}
                onDeleteProject={handleDeleteProject}
                isDeletingProject={isDeletingProject}
              />
            </div>

            <footer className="py-8 text-center text-xs text-slate-400">
              TaskFlow · Your workspace, organized.
            </footer>
          </div>
        </main>
      </div>

      {isProjectFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <form
            onSubmit={handleCreateProject}
            className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Create a project</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Organize related tasks together.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsProjectFormOpen(false)}
                disabled={isProjectSaving}
                aria-label="Close project form"
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <label
                htmlFor="project-name"
                className="mb-2 block text-sm font-medium"
              >
                Project name
              </label>
              <input
                id="project-name"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                maxLength={100}
                required
                autoFocus
                placeholder="e.g. Website Redesign"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {projectFormError && (
              <p role="alert" className="text-sm text-rose-600">
                {projectFormError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsProjectFormOpen(false)}
                disabled={isProjectSaving}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isProjectSaving}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isProjectSaving ? "Saving..." : "Create project"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isTaskFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <form
            onSubmit={handleCreateTask}
            className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {editingTask ? "Edit task" : "Create a task"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add a task to one of your projects.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsTaskFormOpen(false)}
                disabled={isSaving || projectOptions.length === 0}
                aria-label="Close form"
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <label
                htmlFor="task-title"
                className="mb-2 block text-sm font-medium"
              >
                Task title
              </label>
              <input
                id="task-title"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                maxLength={200}
                required
                placeholder="e.g. Build the settings page"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="task-project"
                className="mb-2 block text-sm font-medium"
              >
                Project
              </label>
              <select
                id="task-project"
                value={selectedProjectId}
                onChange={(event) => setSelectedProjectId(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400"
              >
                {projectOptions.length === 0 && (
                  <option value="">No projects available</option>
                )}
                {projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="task-priority"
                  className="mb-2 block text-sm font-medium"
                >
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={taskPriority}
                  onChange={(event) =>
                    setTaskPriority(
                      event.target.value as "LOW" | "MEDIUM" | "HIGH",
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-due-date"
                  className="mb-2 block text-sm font-medium"
                >
                  Due date (optional)
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            {formError && (
              <p role="alert" className="text-sm text-rose-600">
                {formError}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsTaskFormOpen(false)}
                disabled={isSaving || projectOptions.length === 0}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving || projectOptions.length === 0}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : editingTask
                    ? "Save changes"
                    : "Create task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// const navigation = [
//   { label: "Dashboard", icon: LayoutDashboard },
//   { label: "Projects", icon: FolderKanban },
//   { label: "My Tasks", icon: ClipboardList },
//   { label: "Calendar", icon: CalendarDays },
//   { label: "Team", icon: Users },
//   { label: "Settings", icon: Settings },
// ];
