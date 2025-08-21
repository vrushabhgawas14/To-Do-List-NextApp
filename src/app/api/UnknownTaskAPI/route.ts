import { connectDatabase } from "@/lib/mongoDB";
import { UnknownTasks } from "@/models/UnknownTasks";
import { NextRequest, NextResponse } from "next/server";

// GET all Tasks
export const GET = async () => {
  try {
    await connectDatabase();

    const allTask = await UnknownTasks.find({});
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
    const { taskText, priority } = await request.json();

    const newTask = new UnknownTasks({ taskName: taskText, priority });
    await newTask.save();

    return NextResponse.json(newTask, { status: 201 });
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

    const task = await UnknownTasks.findById(id);
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

    await UnknownTasks.findByIdAndDelete(id);

    return NextResponse.json({ message: "Task Deleted!" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error Occurred : " + err },
      { status: 500 }
    );
  }
};
