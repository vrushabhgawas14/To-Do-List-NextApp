import { connectDatabase } from "@/lib/mongoDB";
import { UnknownTasks } from "@/models/UnknownTasks";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDatabase();
    // Enhance Below, as it only fetch taskName
    const allTask = await UnknownTasks.find({}, "taskName");
    return NextResponse.json(allTask);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch Data" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    await connectDatabase();
    const { taskText } = await request.json();

    const newTask = new UnknownTasks({ taskName: taskText });
    await newTask.save();

    return NextResponse.json(
      { message: "Task Added Successfully!" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error Occurred : " + err },
      { status: 500 }
    );
  }
};
