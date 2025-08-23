"use client";
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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("api/UnknownTaskAPI");
        const data = await res.json();
        setTasks(data);
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

      const newTask = await res.json();

      setTasks([...tasks, newTask]);
      setTaskText("");
      setPriority("");
    } catch (err) {
      if (err instanceof Error) console.log("Error :" + err.message);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    const response = await fetch("api/UnknownTaskAPI", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, update: { isCompleted: !task.isCompleted } }),
    });
    const updatedTask = await response.json();
    setTasks((prev) =>
      prev.map((task) => (task._id === id ? updatedTask : task))
    );
  };

  const deleteTask = async (id: string) => {
    await fetch("api/UnknownTaskAPI", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  return (
    <main className="min-h-screen flex items-center justify-center translate-x-0 translate-y-0">
      <div className="bg-red-200/40 p-8 sm:px-4 rounded-2xl shadow-lg w-[50%] md:w-[70%] sm:w-[90%] relative">
        <h1 className="text-center text-white text-xl font-bold mb-4 bg-gradient-to-r from-violet-900 to-blue-900 py-2 rounded-full">
          To Do List
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
          {tasks.map((task) => (
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
    </main>
  );
}
