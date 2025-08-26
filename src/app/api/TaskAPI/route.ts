import { connectDatabase } from "@/lib/mongoDB";
import { LoggedInTasks } from "@/models/loggedInTasks";
import { UnknownTasks } from "@/models/UnknownTasks";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET all Tasks
export const GET = async (request: NextRequest) => {
  try {
    await connectDatabase();
    let allTask = [];
    const category = request.nextUrl.searchParams.get("category");
    const session = await getServerSession();
    if (session?.user) {
      const query: Record<string, unknown> = { user: session.user.email };
      if (category && category.trim() !== "") {
        query.category = category;
      }
      allTask = await LoggedInTasks.find(query);
    }
    return NextResponse.json(allTask);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch Data" },
      { status: 500 }
    );
  }
};

// POST - Add new Task
export const POST = async (request: NextRequest) => {
  try {
    await connectDatabase();
    const { taskText, priority, category } = await request.json();
    const session = await getServerSession();

    let task = [];

    if (session?.user?.email) {
      task = new LoggedInTasks({
        user: session?.user?.email || "User Email Error",
        taskName: taskText,
        priority: priority,
        category: category || "General",
      });
      await task.save();
    } else {
      const guestTask = new UnknownTasks({
        taskName: taskText,
        priority: priority,
      });
      await guestTask.save();
    }

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error Occurred : " + err },
      { status: 500 }
    );
  }
};

//PATCH - Toggle Task Completed
export const PATCH = async (request: NextRequest) => {
  try {
    await connectDatabase();
    const { id, update } = await request.json();

    const task = await LoggedInTasks.findById(id);
    if (!task) {
      return NextResponse.json({ message: "Task not found!" }, { status: 404 });
    }

    if (typeof update.isCompleted === "boolean") {
      task.isCompleted = update.isCompleted;
    }

    if (typeof update.priority === "string") {
      task.priority = update.priority;
    }

    await task.save();
    return NextResponse.json(task);
  } catch (err) {
    return NextResponse.json(
      { message: "Error Occurred : " + err },
      { status: 500 }
    );
  }
};

// DELETE - Remove Task
export const DELETE = async (request: NextRequest) => {
  try {
    await connectDatabase();
    const { id } = await request.json();

    await LoggedInTasks.findByIdAndDelete(id);
    return NextResponse.json({ message: "Task Deleted!" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error Occurred : " + err },
      { status: 500 }
    );
  }
};
