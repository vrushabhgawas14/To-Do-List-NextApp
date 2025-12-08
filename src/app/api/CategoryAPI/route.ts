import { connectDatabase } from "@/lib/mongoDB";
import { LoggedInTasks } from "@/models/loggedInTasks";
import { TaskCategory } from "@/models/TaskCategory";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDatabase();
    const session = await getServerSession();
    let allCategory = [];
    if (session?.user) {
      allCategory = await TaskCategory.find({ user: session.user.email });
    }

    return NextResponse.json(allCategory);
  } catch (err) {
    return NextResponse.json(
      { message: "Internal Server Error!" + err},
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    await connectDatabase();
    const { category } = await request.json();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Please sign in to create new categories." },
        { status: 401 } // unauthorized
      );
    }
    
    let newCategory = [];
    const categoryExist = await TaskCategory.findOne({
      user: session.user.email,
      categoryName: category,
    });

    if (!categoryExist) {
      newCategory = new TaskCategory({
        user: session.user.email,
        categoryName: category,
      });
      await newCategory.save();
    }

    return NextResponse.json(newCategory, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error Occurred : " + err },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    await connectDatabase();
    const { category } = await request.json();
    const session = await getServerSession();
    if (session?.user?.email) {
      await LoggedInTasks.deleteMany({
        user: session.user.email,
        category: category,
      });

      await TaskCategory.deleteMany({
        user: session.user.email,
        categoryName: category,
      });
    }
    return NextResponse.json({ message: "Task Deleted!" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error Occurred : " + err },
      { status: 500 }
    );
  }
};
