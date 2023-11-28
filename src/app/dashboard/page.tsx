"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./styles.module.css";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import TextArea from "@/components/textArea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/services/firebaseConection";
import Link from "next/link";

interface userProps {
  email: string;
  image: string;
  name: string;
}
interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  task: string;
  user: userProps;
}

const Dashboard = () => {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) {
      redirect("/");
    }
  }, []);

  useEffect(() => {
    async function loadTasks() {
      const taskRef = collection(db, "tasks");
      const q = query(
        taskRef,
        orderBy("created", "desc"),
        where("user", "==", session?.user)
      );
      onSnapshot(q, (snapshot) => {
        let taskList = [] as TaskProps[];
        snapshot.forEach((doc) => {
          taskList.push({
            id: doc.id,
            task: doc.data().task,
            public: doc.data().public,
            created: doc.data().created,
            user: doc.data().user,
          });
        });
        setTasks(taskList);
      });
    }
    loadTasks();
  }, [session?.user?.email]);

  const handleChangePublic = (event: ChangeEvent<HTMLInputElement>) => {
    setPublicTask(event.target.checked);
  };

  const handleRegisterTask = async (event: FormEvent) => {
    event.preventDefault();

    if (input === "") return;

    try {
      await addDoc(collection(db, "tasks"), {
        task: input,
        created: new Date(),
        user: session?.user,
        public: publicTask,
      });
      setInput("");
      setPublicTask(false);
    } catch (e: any) {
      console.log("Error" + e.message);
    }
  };
  const handleShare = async (id: string) => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );
  };

  const handleDelete = async (id: string) => {
    const docRef = doc(db, "tasks", id);
    await deleteDoc(docRef);
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>My Panel</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={`${styles.title} text-3xl`}>What is your task?</h1>
            <form onSubmit={handleRegisterTask}>
              <TextArea
                placeholder="Type yout task..."
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label>Turn an public task?</label>
              </div>
              <button className={styles.button} type="submit">
                Register
              </button>
            </form>
          </div>
        </section>
        <section className={styles.taskContainer}>
          <h1>MY Tasks</h1>

          {tasks.length === 0 && (
            <div className={styles.task}>
              <h2 className="text-xl"> Dont have any tasks yet</h2>
            </div>
          )}

          {tasks.map((task) => {
            return (
              <article className={styles.task} key={task.id}>
                {task.public && (
                  <div className={styles.tagContainer}>
                    <label className={styles.tag}>Public</label>
                    <button className={styles.shareButton}>
                      <FiShare2
                        size={22}
                        color="#3183ff"
                        onClick={() => handleShare(task.id)}
                      />
                    </button>
                  </div>
                )}
                <div className={styles.taskContent}>
                  {task.public ? (
                    <Link href={`/task/${task.id}`}>
                      <p>{task.task}</p>
                    </Link>
                  ) : (
                    <p>{task.task}</p>
                  )}
                  <button
                    className={styles.tashButton}
                    onClick={() => {
                      handleDelete(task.id);
                    }}
                  >
                    <FaTrash size={24} color="#ea3140" />
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
