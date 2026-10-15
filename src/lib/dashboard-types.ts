export type TaskStatus = "Todo" | "In Progress" | "Completed";
export type Priority = "Low" | "Medium" | "High";

export type Task = {
  id: string;
  title: string;
  project: string;
  status: TaskStatus;
  priority: Priority;
  due: string;
};

export type Project = {
  name: string;
  tasks: number;
  completed: number;
  color: "violet" | "blue" | "emerald";
};

export type ProjectOption = {
  id: string;
  name: string;
};