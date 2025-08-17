"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
  priority: number;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    const storedTask = localStorage.getItem("tasks");
    if (storedTask) {
      setTasks(JSON.parse(storedTask));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log("Hello " + JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!taskText.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      priority: Number(priority) || 0,
    };

    setTasks([...tasks, newTask]);
    setTaskText("");
    setPriority("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <main className="min-h-screen flex items-center justify-center sm:-translate-y-40">
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

        <ul className="space-y-3 w-full">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-2 border-b-2 border-slate-900"
            >
              <Image
                src={
                  task.completed
                    ? "/assets/images/checked.png"
                    : "/assets/images/unchecked.png"
                }
                width="6"
                height="6"
                sizes="8vw"
                alt="Checkbox Image"
                className="h-6 w-6 sm:h-5 sm:w-5 cursor-pointer"
                onClick={() => toggleTask(task.id)}
              />

              {/* Task text */}
              <div
                className={`flex-1 font-semibold text-md sm:text-lg break-words overflow-hidden cursor-pointer ${
                  task.completed ? "line-through italic text-gray-800" : ""
                }`}
                onClick={() => toggleTask(task.id)}
              >
                {task.text}
              </div>

              <input
                type="text"
                value={task.priority || ""} // Controlled input
                onChange={(e) =>
                  setTasks((prev) =>
                    prev.map((t) =>
                      t.id === task.id
                        ? { ...t, priority: Number(e.target.value) }
                        : t
                    )
                  )
                }
                className="bg-transparent outline-none border-b-2 border-black/50 text-center w-16 sm:w-12 text-lg"
                placeholder="P"
              />

              <button
                onClick={() => deleteTask(task.id)}
                tabIndex={-1}
                className="text-red-950 hover:bg-red-700/20 px-2 py-2 rounded-full font-bold text-2xl sm:text-lg"
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
