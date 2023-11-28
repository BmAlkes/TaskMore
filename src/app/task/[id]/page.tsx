"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConection";
import { redirect, useRouter } from "next/navigation";

interface TaskDetailProps {
  params: {
    id: string;
  };
}

const Task = ({ params: { id } }: TaskDetailProps) => {
  const router = useRouter();
  const [task, setTask] = useState({});

  useEffect(() => {
    const loadTask = async (id: string) => {
      const docRef = doc(db, "tasks", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.data() === undefined) {
        router.push("/dashboard");
      }
      if (!snapshot.data()?.public) {
        router.push("/dashboard");
      }
      const miliseconds = snapshot.data()?.created?.seconds * 1000;
      const task = {
        task: snapshot.data()?.task,
        public: snapshot.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id,
      };
      setTask(task);
    };
    loadTask(id);
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>{id}</h1>
      </main>
    </div>
  );
};

export default Task;
