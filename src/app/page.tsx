"use client";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Menu, X } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Task = {
  _id: string;
  taskName: string;
  isCompleted: boolean;
  priority: string;
  category?: string;
};

type Category = {
  _id: string;
  categoryName: string;
};

export default function Home() {
  const defaultCategory = "General";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("");
  const [isLogoutBtnOpen, setLogoutBtnOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([defaultCategory]);
  const [newCategory, setNewCategory] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isdeleteCatBtnOpen, setDeleteCatBtnOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (session?.user) {
          setIsDataLoading(true);
          const res = await fetch(
            `api/TaskAPI?category=${
              selectedCategory ? selectedCategory : defaultCategory
            }`
          );
          const data = await res.json();

          if (data) {
            setTasks(data);
            setIsDataLoading(false);
          }

          if (selectedCategory) {
            localStorage.setItem("lastCat", selectedCategory);
          }
        } else {
          // Guest Tasks
          const storedTask = localStorage.getItem("tasks");
          if (storedTask) setTasks(JSON.parse(storedTask));
          setIsDataLoading(false);
        }
      } catch (err) {
        if (err instanceof Error) console.log("Error :" + err.message);
      }
    };
    fetchTasks();
  }, [session, selectedCategory]);

  const fetchCategories = async () => {
    if (session?.user) {
      const res = await fetch(`api/CategoryAPI`);
      const data = await res.json();

      if (data) {
        const uniqueCategories: string[] = Array.from(
          new Set([
            defaultCategory,
            ...data?.map((t: Category) => t.categoryName),
          ])
        );
        setCategories(uniqueCategories);
        const lastCat = localStorage.getItem("lastCat");
        if (lastCat && uniqueCategories.includes(lastCat)) {
          setSelectedCategory(lastCat);
        }
      }
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchCategories();
    }
  }, [session?.user?.email]);

  // Guest Tasks
  useEffect(() => {
    if (!session?.user) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, session]);

  const addTask = async () => {
    if (!taskText.trim()) return;

    try {
      const res = await fetch("api/TaskAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskText,
          priority,
          category: selectedCategory,
        }),
      });

      if (session?.user) {
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
      } else {
        const newTask: Task = {
          _id: Date.now().toString(),
          taskName: taskText,
          isCompleted: false,
          priority: priority,
          category: defaultCategory,
        };
        setTasks([...tasks, newTask]);
      }

      setTaskText("");
      setPriority("");
    } catch (err) {
      if (err instanceof Error) console.log("Error :" + err.message);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    if (session?.user) {
      const response = await fetch("api/TaskAPI", {
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
    } else {
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, isCompleted: !task.isCompleted } : task
        )
      );
    }
  };

  const updatePriority = async (_id: string, newPriority: string) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === _id ? { ...t, priority: newPriority } : t))
    );

    if (session?.user) {
      await fetch("api/TaskAPI", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: _id,
          update: { priority: newPriority },
        }),
      });
    }
  };

  const deleteTask = async (id: string) => {
    if (session?.user) {
      await fetch("api/TaskAPI", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } else {
      setTasks(tasks.filter((task) => task._id !== id));
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory)) {
      const res = await fetch("api/CategoryAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: newCategory,
        }),
      });

      if (res.status === 401) {
        alert(
          "Please sign in to create categories and sync data across your devices."
        );
        return;
      }
      const newCategoryAdded = await res.json();

      if (newCategoryAdded && newCategoryAdded.categoryName) {
        setCategories([...categories, newCategoryAdded.categoryName]);
        setSelectedCategory(newCategoryAdded.categoryName);
      }
      setNewCategory("");
    } else if (categories.includes(newCategory)) {
      alert("This category name already exists!");
      return;
    }
  };

  const handleDeleteCategory = async (selectedTaskCategory: string) => {
    if (session?.user) {
      const deletedResponse = await fetch("api/CategoryAPI", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: selectedTaskCategory,
        }),
      });

      if (deletedResponse.status === 201) {
        setTasks([]);
        setSelectedCategory(defaultCategory);
        localStorage.setItem("lastCat", "");
        fetchCategories();
      }
    } else {
      localStorage.setItem("tasks", JSON.stringify([]));
      setSelectedCategory(defaultCategory);
    }
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

  const downward = (
    <svg viewBox="0 0 330 330" className="fill-black w-3 h-3">
      <path d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"></path>
    </svg>
  );

  return (
    <>
      <main className="flex justify-between p-4 w-full">
        {/* Hamburger Menu */}
        <section>
          {!isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute top-4 left-4 z-50 p-2 bg-purple-950 text-white rounded-md"
              tabIndex={-1}
            >
              <Menu size={24} />
            </button>
          )}
          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-screen w-64 bg-purple-950 text-white p-4 transform transition-transform duration-300 z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            {/* Sidebar content */}
            <div className="flex flex-col gap-y-5">
              <div className="flex justify-between my-2">
                <h2 className="font-bold text-lg">Categories</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white"
                  tabIndex={-1}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-2">
                {categories?.map((cat, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer p-1 rounded font-semibold hover:bg-purple-900 ${
                      selectedCategory === cat ? "bg-purple-800" : ""
                    }`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSidebarOpen(false);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 py-4 flex-col">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                  required
                  placeholder="Enter category"
                  className="px-3 py-1 rounded focus:outline-none border border-purple-300 text-purple-900 font-semibold"
                  tabIndex={-1}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-white text-purple-900 px-3 py-1 rounded font-medium hover:bg-purple-100"
                  tabIndex={-1}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="min-w-max">
          {session?.user ? (
            <div className="flex flex-col gap-y-2 relative">
              <div
                className="flex items-center gap-x-5 cursor-pointer bg-violet-800  
              border-2 border-zinc-200/40 px-2 py-1 rounded-xl"
                onClick={() => setLogoutBtnOpen(!isLogoutBtnOpen)}
              >
                {isLogoutBtnOpen && (
                  <h2 className="text-zinc-200 font-semibold">
                    {session?.user?.name || session?.user?.email}
                  </h2>
                )}
                {session?.user?.image && (
                  <Image
                    height={50}
                    width={50}
                    src={session.user?.image}
                    alt="My Image"
                    className="w-8 h-8 border border-white rounded-3xl"
                  />
                )}
              </div>
              {isLogoutBtnOpen && (
                <>
                  <button
                    onClick={() => setLogoutConfirmationOpen(true)}
                    className="absolute top-14 right-0 z-50 text-sm px-8 py-1 text-red-100 border-2 border-red-100 border-opacity-90 rounded-xl ease-in duration-200 hover:bg-purple-200 hover:text-violet-950 font-semibold hover:border-zinc-200/40"
                  >
                    LogOut
                  </button>
                  <ConfirmDialog
                    isOpen={isLogoutConfirmationOpen}
                    message="Are you sure you want to logout?"
                    onConfirm={() => {
                      signOut();
                      localStorage.setItem("lastCat", "");
                      setLogoutConfirmationOpen(false);
                      setLogoutBtnOpen(false);
                    }}
                    onCancel={() => {
                      setLogoutConfirmationOpen(false);
                      setLogoutBtnOpen(false);
                    }}
                  />
                </>
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

      {/* Delete Confirmation Dialog Box */}
      <main>
        {isdeleteCatBtnOpen && (
          <ConfirmDialog
            isOpen={isDeleteConfirmationOpen}
            message="Are you sure to delete Category and tasks in it?"
            onConfirm={() => {
              handleDeleteCategory(selectedCategory);
              setDeleteCatBtnOpen(false);
              setDeleteConfirmationOpen(false);
            }}
            onCancel={() => {
              setDeleteCatBtnOpen(false);
              setDeleteConfirmationOpen(false);
            }}
          />
        )}
      </main>
      <main className="relative min-h-screen flex items-start justify-center translate-x-0 translate-y-0">
        <div className="sm:mt-10 md:mt-5 bg-red-200/40 p-8 pt-2 sm:px-4 rounded-2xl shadow-lg w-[50%] md:w-[70%] sm:w-[90%] relative">
          {/* Category Name */}
          <div className="py-2 flex flex-col items-end text-sm gap-y-2">
            <div className="bg-red-100/50 px-2 border border-blue-950 rounded-xl cursor-pointer flex flex-col justify-center">
              <div
                className="flex items-center gap-x-2"
                onClick={() => setDeleteCatBtnOpen(!isdeleteCatBtnOpen)}
              >
                Category :
                <span className="italic">
                  {selectedCategory ? selectedCategory : defaultCategory}
                </span>
                <span>{downward}</span>
              </div>
              {isdeleteCatBtnOpen && (
                <>
                  <button
                    className="bg-red-100/50 px-2 my-2 border border-blue-950 rounded-xl cursor-pointer"
                    onClick={() => setDeleteConfirmationOpen(true)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Card Header */}
          <h1 className="text-center text-white text-xl font-bold mb-4 bg-gradient-to-r from-violet-900 to-blue-900 py-2 rounded-full">
            Tick the Untick&apos;s
          </h1>

          {/* Task Input */}
          <div className="flex flex-1 items-center justify-between rounded-full bg-red-50 mb-6 border-b border-t border-l border-blue-950">
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

          {/* Added Tasks */}
          {isDataLoading ? (
            <div className="text-center italic">Loading...</div>
          ) : (
            <ul className="space-y-2 w-full">
              {tasks &&
                tasks?.map((task) => (
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
                        task.isCompleted
                          ? "line-through italic text-gray-800"
                          : ""
                      }`}
                      onClick={() => toggleTask(task._id)}
                    >
                      {task.taskName}
                    </div>

                    <input
                      type="text"
                      value={task.priority || ""} // Controlled input
                      onChange={(e) => updatePriority(task._id, e.target.value)}
                      className={`bg-transparent outline-none border-b-2 border-black/50 text-center w-16 sm:w-12 text-sm sm:text-sm  ${
                        task.isCompleted
                          ? "line-through italic text-gray-800"
                          : ""
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
          )}
        </div>
      </main>
      <footer className="text-center text-blue-200 font-semibold my-2">
        © 2025 Developed by{" "}
        <a href="https://vrushabhgawas14.github.io" className="underline">
          Vrushabh Gawas
        </a>
        .
      </footer>
    </>
  );
}
