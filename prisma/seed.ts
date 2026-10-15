
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@taskflow.local" },
    update: {},
    create: {
      name: "TaskFlow Demo",
      email: "demo@taskflow.local",
    },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: "TaskFlow Workspace",
      memberships: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  const project = await prisma.project.create({
    data: {
      name: "Website Redesign",
      workspaceId: workspace.id,
      tasks: {
        create: [
          {
            title: "Design the dashboard",
            status: "COMPLETED",
            priority: "HIGH",
            creatorId: user.id,
          },
          {
            title: "Build the task management API",
            status: "IN_PROGRESS",
            priority: "HIGH",
            creatorId: user.id,
            assigneeId: user.id,
          },
          {
            title: "Add database integration",
            status: "TODO",
            priority: "MEDIUM",
            creatorId: user.id,
            assigneeId: user.id,
          },
          {
            title: "Kill the Project",
            status: "IN_PROGRESS",
            priority: "HIGH",
            creatorId: user.id,
            assigneeId: user.id,
          },
        ],
      },
    },
  });

  console.log("Seed completed:", {
    user: user.email,
    workspace: workspace.name,
    project: project.name,
  });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
