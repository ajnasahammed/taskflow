export type TaskStatus = "Todo" | "In Progress" | "Completed";
export type Priority = "Low" | "Medium" | "High";

export type Task = {
  id: string;
  title: string;
  project: string;
  projectId: string | null;
  status: TaskStatus;
  priority: Priority;
  due: string;
  dueDate: string | null;
};

export type Project = {
  id: string;
  name: string;
  tasks: number;
  completed: number;
  color: "violet" | "blue" | "emerald";
};

export type ProjectOption = {
  id: string;
  name: string;
};
