"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Task = {
  _id: string;
  taskName: string;
  isCompleted: boolean;
  priority: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("");
  const { data: session } = useSession();
  const [isLogoutBtnOpen, setLogoutBtnOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // if (session?.user) {
        const res = await fetch("api/UnknownTaskAPI");
        const data = await res.json();
        setTasks(data);
        // } else {
        //   const storedTask = localStorage.getItem("tasks");
        //   if (storedTask) {
        //     setTasks(JSON.parse(storedTask));
        //   }
        // }
      } catch (err) {
        if (err instanceof Error) console.log("Error :" + err.message);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!taskText.trim()) return;

    try {
      const res = await fetch("api/UnknownTaskAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskText, priority }),
      });

      // if (session?.user) {
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      // } else {
      //   const newTask: Task = {
      //     _id: Date.now().toString(),
      //     taskName: taskText,
      //     isCompleted: false,
      //     priority: priority,
      //   };
      //   setTasks([...tasks, newTask]);
      //   localStorage.setItem("tasks", JSON.stringify(tasks));
      // }

      setTaskText("");
      setPriority("");
    } catch (err) {
      if (err instanceof Error) console.log("Error :" + err.message);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    // if (session?.user) {
    const response = await fetch("api/UnknownTaskAPI", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        update: { isCompleted: !task.isCompleted },
      }),
    });
    const updatedTask = await response.json();
    setTasks((prev) =>
      prev.map((task) => (task._id === id ? updatedTask : task))
    );
    // } else {
    //   setTasks(
    //     tasks.map((task) =>
    //       task._id === id ? { ...task, isCompleted: !task.isCompleted } : task
    //     )
    //   );
    // }
  };

  const deleteTask = async (id: string) => {
    // if (session?.user) {
    await fetch("api/UnknownTaskAPI", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    setTasks(tasks.filter((task) => task._id !== id));
    // } else {
    //   setTasks(tasks.filter((task) => task._id !== id));
    // }
  };

  const GoogleLogo = (
    <svg
      viewBox="-3 0 262 262"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
    >
      <path
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
        fill="#4285F4"
      ></path>
      <path
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
        fill="#34A853"
      ></path>
      <path
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
        fill="#FBBC05"
      ></path>
      <path
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
        fill="#EB4335"
      ></path>
    </svg>
  );

  return (
    <main className="relative min-h-screen flex items-center justify-center translate-x-0 translate-y-0">
      <div className="bg-red-200/40 p-8 sm:px-4 rounded-2xl shadow-lg w-[50%] md:w-[70%] sm:w-[90%] relative">
        <h1 className="text-center text-white text-xl font-bold mb-4 bg-gradient-to-r from-violet-900 to-blue-900 py-2 rounded-full">
          Tick the Untick&apos;s
        </h1>

        <div className="flex flex-1 items-center justify-between rounded-full bg-red-50 mb-6 border-b-2 border-t-2 border-l-2 border-slate-900">
          <input
            type="text"
            className="px-4 py-1 text-md sm:text-sm outline-none bg-red-50/80 rounded-full text-black font-semibold w-[100%]"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                e.preventDefault();
                addTask();
              }
            }}
            placeholder="Add your Task"
          />
          <button
            onClick={addTask}
            className="px-4 py-1 rounded-full text-xl sm:text-xl text-white bg-gradient-to-r from-violet-900 to-blue-900 w-[15%] sm:w-16"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2 w-full">
          {tasks?.map((task) => (
            <li
              key={task._id}
              className="flex items-center gap-2 border-b-2 border-slate-900/50"
            >
              <Image
                src={
                  task.isCompleted
                    ? "/assets/images/checked.png"
                    : "/assets/images/unchecked.png"
                }
                width="4"
                height="4"
                sizes="8vw"
                alt="Checkbox Image"
                className="h-4 w-4 sm:h-4 sm:w-4 cursor-pointer"
                onClick={() => toggleTask(task._id)}
              />

              {/* Task text */}
              <div
                className={`flex-1 font-semibold text-sm sm:text-base break-words overflow-hidden cursor-pointer ${
                  task.isCompleted ? "line-through italic text-gray-800" : ""
                }`}
                onClick={() => toggleTask(task._id)}
              >
                {task.taskName}
              </div>

              <input
                type="text"
                value={task.priority || ""} // Controlled input
                onChange={async (e) => {
                  const newPriority = e.target.value;

                  setTasks((prev) =>
                    prev.map((t) =>
                      t._id === task._id ? { ...t, priority: newPriority } : t
                    )
                  );

                  await fetch("api/UnknownTaskAPI", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: task._id,
                      update: { priority: newPriority },
                    }),
                  });
                }}
                className={`bg-transparent outline-none border-b-2 border-black/50 text-center w-16 sm:w-12 text-lg  ${
                  task.isCompleted ? "line-through italic text-gray-800" : ""
                }`}
                placeholder="Text"
              />

              <button
                onClick={() => deleteTask(task._id)}
                tabIndex={-1}
                className="text-red-950 hover:bg-red-700/20 px-2 py-2 rounded-full font-bold text-md sm:text-sm"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
      <section className="absolute top-5 right-5">
        {session?.user ? (
          <div className="flex flex-col gap-y-2">
            <div
              className="flex items-center gap-x-5 cursor-pointer bg-violet-800  
              border-2 border-zinc-200/40 px-2 py-1 rounded-xl"
              onClick={() => setLogoutBtnOpen(!isLogoutBtnOpen)}
            >
              <h2 className="text-zinc-200 font-semibold">
                {session?.user?.name || session?.user?.email}
              </h2>
              {session?.user?.image && (
                <Image
                  height={50}
                  width={50}
                  src={session.user?.image}
                  alt="My Image"
                  className="w-8 h-8 border-2 border-white rounded-3xl"
                />
              )}
            </div>
            {isLogoutBtnOpen && (
              <button
                onClick={() => signOut()}
                className="px-4 py-1 text-red-100 border-2 border-red-100 border-opacity-90 rounded-xl ease-in duration-200 hover:bg-purple-200 hover:text-violet-950 font-semibold hover:border-zinc-200/40"
              >
                LogOut
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="flex items-center space-x-2 font-semibold text-lg px-2 py-1 bg-zinc-300 text-black hover:bg-zinc-100 rounded-xl text-center"
          >
            <span>{GoogleLogo}</span>
            <span>Sign in With Google</span>
          </button>
        )}
      </section>
    </main>
  );
}
