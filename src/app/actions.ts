"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized. Please sign in.");
  }

  return session;
}

export async function ensureUserWorkspace() {
  const session = await requireSession();
  const userId = session.user.id;

  return prisma.$transaction(async (tx) => {
    const membership = await tx.membership.findFirst({
      where: { userId },
      select: { workspaceId: true },
    });

    if (membership) {
      return { workspaceId: membership.workspaceId };
    }

    const name = session.user.name?.trim() || "My";

    const workspace = await tx.workspace.create({
      data: {
        name: `${name}'s Workspace`,
        memberships: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
      select: { id: true },
    });

    return { workspaceId: workspace.id };
  });
}

export async function setTaskCompletion(id: string, completed: boolean) {
  const session = await requireSession();

  const task = await prisma.task.findFirst({
    where: {
      id,
      OR: [
        {
          workspace: {
            memberships: {
              some: { userId: session.user.id },
            },
          },
        },
        {
          project: {
            workspace: {
              memberships: {
                some: { userId: session.user.id },
              },
            },
          },
        },
      ],
    },
    select: { id: true },
  });

  if (!task) {
    throw new Error(
      "Task not found or you don't have permission to update it.",
    );
  }

  const updatedTask = await prisma.task.update({
    where: { id: task.id },
    data: { status: completed ? "COMPLETED" : "TODO" },
    select: { id: true, status: true },
  });

  revalidatePath("/");
  return updatedTask;
}

export async function createTask(input: {
  title: string;
  projectId: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string;
}) {
  const session = await requireSession();
  const title = input.title.trim();

  if (!title || title.length > 200) {
    throw new Error("Task title must be between 1 and 200 characters.");
  }

  if (!["LOW", "MEDIUM", "HIGH"].includes(input.priority)) {
    throw new Error("Invalid task priority.");
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    select: { workspaceId: true },
  });

  if (!membership) {
    throw new Error("No workspace found. Please sign out and sign in again.");
  }

  let projectId: string | null = null;

  if (input.projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: input.projectId,
        workspaceId: membership.workspaceId,
      },
      select: { id: true },
    });

    if (!project) {
      throw new Error(
        "The selected project doesn't exist or you don't have access to it.",
      );
    }

    projectId = project.id;
  }

  let dueDate: Date | null = null;

  if (input.dueDate) {
    dueDate = new Date(`${input.dueDate}T12:00:00`);

    if (Number.isNaN(dueDate.getTime())) {
      throw new Error("Invalid due date.");
    }
  }

  const task = await prisma.task.create({
    data: {
      title,
      projectId,
      workspaceId: membership.workspaceId,
      creatorId: session.user.id,
      priority: input.priority,
      dueDate,
    },
    select: { id: true },
  });

  revalidatePath("/");
  return task;
}

export async function createProject(input: { name: string }) {
  const session = await requireSession();
  const name = input.name.trim();

  if (!name || name.length > 100) {
    throw new Error("Project name must be between 1 and 100 characters.");
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    select: { workspaceId: true },
  });

  if (!membership) {
    throw new Error("No workspace found. Please sign in again.");
  }

  const existingProject = await prisma.project.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
      workspaceId: membership.workspaceId,
    },
    select: { id: true },
  });

  if (existingProject) {
    throw new Error("A project with this name already exists.");
  }

  const project = await prisma.project.create({
    data: {
      name,
      workspaceId: membership.workspaceId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  revalidatePath("/");
  return project;
}
