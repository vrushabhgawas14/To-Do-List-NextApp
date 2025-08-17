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
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-red-200/40 p-8 sm:px-4 rounded-2xl shadow-lg w-[50%] md:w-[70%] sm:w-[90%]">
        <h1 className="text-center text-white text-xl font-bold mb-4 bg-gradient-to-r from-violet-900 to-blue-900 py-2 rounded-full">
          To Do List
        </h1>

        <div className="flex flex-1 items-center justify-between rounded-full bg-red-50/50 mb-6 border-b-2 border-t-2 border-l-2 border-slate-900">
          <input
            type="text"
            className="px-4 py-2 text-xl sm:text-lg outline-none bg-transparent text-black z-20 font-semibold w-[100%]"
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
            className="px-4 py-2 rounded-full text-2xl sm:text-xl text-white bg-gradient-to-r from-violet-900 to-blue-900 w-[15%] sm:w-16"
          >
            Add
          </button>
        </div>

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between border-b-2 border-slate-900"
            >
              <div className="flex items-center gap-2">
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

                <div
                  className={`flex flex-1 justify-between px-5 cursor-pointer text-slate-950 w-full ${
                    task.completed ? "line-through italic text-opacity-60" : ""
                  }`}
                >
                  <div
                    className="text-xl font-semibold sm:text-lg break-words "
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.text}
                  </div>
                  <input
                    type="text"
                    className="bg-transparent outline-none border-b-2 border-black px-4 sm:px-2 w-24 sm:w-14 text-lg"
                    placeholder="Priority"
                  />
                </div>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                tabIndex={-1}
                className="text-red-950 hover:bg-red-700/50 px-2 py-2 rounded-full font-bold text-2xl sm:text-lg"
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
