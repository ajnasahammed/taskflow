
import "server-only";

import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string) {
  const workspaceMembership = {
    memberships: {
      some: { userId },
    },
  };

  const [projects, tasks] = await Promise.all([
    prisma.project.findMany({
      where: {
        workspace: workspaceMembership,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    }),

    prisma.task.findMany({
      where: {
        OR: [
          {
            workspace: workspaceMembership,
          },
          {
            project: {
              workspace: workspaceMembership,
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        project: {
          select: { name: true },
        },
      },
    }),
  ]);

  return { projects, tasks };
}
