
import "server-only";

import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const [projects, tasks] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        tasks: true,
      },
    }),

    prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: { name: true },
        },
        assignee: {
          select: { name: true },
        },
      },
    }),
  ]);

  return { projects, tasks };
}

