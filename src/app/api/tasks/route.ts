import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

// In-memory tasks store keyed by userId for demo only
const taskStore = new Map();

export async function GET() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = await getUser();
  const userId = user?.id || "";
  let tasks = taskStore.get(userId) || [];
  return NextResponse.json({ tasks });
}

export async function POST(request) {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = await getUser();
  const userId = user?.id || "";

  const { title } = await request.json();
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return new Response("Invalid title", { status: 400 });
  }

  const userTasks = taskStore.get(userId) || [];
  const newTask = { id: Date.now().toString(), title, complete: false };
  userTasks.push(newTask);
  taskStore.set(userId, userTasks);

  return NextResponse.json({ task: newTask });
}

export async function PUT(request) {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = await getUser();
  const userId = user?.id || "";

  const { id, complete } = await request.json();
  const userTasks = taskStore.get(userId) || [];

  const taskIndex = userTasks.findIndex((t) => t.id === id);
  if (taskIndex < 0) {
    return new Response("Task not found", { status: 404 });
  }

  userTasks[taskIndex].complete = !!complete;
  taskStore.set(userId, userTasks);

  return NextResponse.json({ task: userTasks[taskIndex] });
}

export async function DELETE(request) {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = await getUser();
  const userId = user?.id || "";

  const { id } = await request.json();

  let userTasks = taskStore.get(userId) || [];

  userTasks = userTasks.filter((t) => t.id !== id);
  taskStore.set(userId, userTasks);

  return NextResponse.json({ message: "Deleted" });
}
