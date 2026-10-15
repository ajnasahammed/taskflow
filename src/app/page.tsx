import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { getDashboardData } from "@/lib/dashboard";
import DashboardClient from "@/components/DashboardClient";
import type { Project, Task, ProjectOption } from "@/lib/dashboard-types";

async function DashboardData({ userId }: { userId: string }) {
  const { projects: dbProjects, tasks: dbTasks } =
    await getDashboardData(userId);

  const initialTasks: Task[] = dbTasks.map((task) => ({
    id: task.id,
    title: task.title,
    project: task.project?.name ?? "No Project",
    status:
      task.status === "COMPLETED"
        ? "Completed"
        : task.status === "IN_PROGRESS"
          ? "In Progress"
          : "Todo",
    priority: (task.priority.charAt(0) +
      task.priority.slice(1).toLowerCase()) as Task["priority"],
    due: task.dueDate
      ? task.dueDate.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        })
      : "No date",
  }));

  const colors: Project["color"][] = ["violet", "blue", "emerald"];

  const projects: Project[] = dbProjects.map((project, index) => ({
    name: project.name,
    tasks: project.tasks.length,
    completed: project.tasks.filter((task) => task.status === "COMPLETED")
      .length,
    color: colors[index % colors.length],
  }));

  const projectOptions: ProjectOption[] = dbProjects.map((project) => ({
    id: project.id,
    name: project.name,
  }));

  return (
    <DashboardClient
      initialTasks={initialTasks}
      projects={projects}
      projectOptions={projectOptions}
    />
  );
}

function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] p-8 text-slate-900">
      <div className="mx-auto max-w-5xl animate-pulse space-y-6">
        <div className="h-8 w-64 rounded-lg bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-28 rounded-2xl bg-white" />
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-white" />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AuthenticatedDashboard />
    </Suspense>
  );
}

async function AuthenticatedDashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <DashboardData userId={session.user.id} />;
}
