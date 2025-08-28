import { connectDatabase } from "@/lib/mongoDB";
import { TaskCategory } from "@/models/TaskCategory";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"

export const GET = async () =>{
    try{
        await connectDatabase();
        const session = await getServerSession();
        let allCategory = [];
        if(session?.user){
            allCategory = await TaskCategory.find({user : session.user.email});
        }

        return NextResponse.json(allCategory);
    } catch (err) {
        return NextResponse.json(
        { message: "Failed to fetch Data : " + err },
        { status: 500 }
        );
    }
};

export const POST = async(request : NextRequest)=>{
    try{
        await connectDatabase();
        const {category} = await request.json();
        const session = await getServerSession();

        let newCategory = [];
        if (session?.user?.email) {
            const categoryExist = await TaskCategory.findOne({user : session.user.email, categoryName : category})
            if(!categoryExist){
                newCategory = new TaskCategory({user : session.user.email, categoryName : category});
                await newCategory.save();
            }
        }

        return NextResponse.json(newCategory, {status : 201})
    } catch (err) {
    return NextResponse.json(
      { message: "Error Occurred : " + err },
      { status: 500 }
    );
  }
};