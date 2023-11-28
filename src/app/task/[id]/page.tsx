"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./styles.module.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebaseConection";
import { redirect, useRouter } from "next/navigation";
import TextArea from "@/components/textArea";
import { useSession } from "next-auth/react";
import { FaTrash } from "react-icons/fa";

interface TaskDetailProps {
  params: {
    id: string;
  };
}
interface TaskProps {
  task: string;
  created: string;
  public: boolean;
  user: string;
  taskId: string;
}
interface AllCommentsProps {
  comment: string;
  created: number;
  name: string;
  taskId: string;
  user: string;
  id: string;
}

const Task = ({ params: { id } }: TaskDetailProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [task, setTask] = useState<TaskProps>();
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState<AllCommentsProps[]>([]);

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

  useEffect(() => {
    const getComments = async () => {
      const q = query(collection(db, "comment"), where("taskId", "==", id));
      const snapshotComments = await getDocs(q);

      let allComments: AllCommentsProps[] = [];
      snapshotComments.forEach((doc) => {
        allComments.push({
          id: doc.id,
          comment: doc.data().comment,
          user: doc.data().user,
          name: doc.data().name,
          taskId: doc.data().taskId,
          created: doc.data().created.seconds * 1000,
        });
      });
      setAllComments(allComments);
    };
    getComments();
  }, [comment, allComments]);

  const handleComment = async (e: FormEvent) => {
    e.preventDefault();
    if (comment === "") return;

    try {
      const docRef = await addDoc(collection(db, "comment"), {
        comment: comment,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: task?.taskId,
      });
      setComment("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteComment = async (id: string) => {
    const docRef = doc(db, "comment", id);
    await deleteDoc(docRef);
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Task</h1>

        <article className={styles.task}>
          <p>{task?.task}</p>
        </article>
      </main>
      <section className={styles.commentContainer}>
        <h2> Let a comment</h2>
        <form onSubmit={handleComment}>
          <TextArea
            placeholder="write a comment..."
            value={comment}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setComment(e.target.value)
            }
          />
          <button
            className={styles.button}
            type="submit"
            disabled={!session?.user}
          >
            Send comment
          </button>
        </form>
      </section>

      <section className={styles.commentContainer}>
        <h2>All Comments</h2>
        {allComments.length === 0 && (
          <span style={{ color: "#fff" }}> No Comments found </span>
        )}
        {allComments.map((comment) => (
          <article key={comment.id} className={styles.comment}>
            <div className={styles.headComment}>
              <label className={styles.commentsLabel}>{comment.name}</label>
              {comment.user === session?.user?.email && (
                <button className={styles.buttonTrash}>
                  <FaTrash
                    size={18}
                    color="#ea3140"
                    onClick={() => handleDeleteComment(comment.id)}
                  />
                </button>
              )}
            </div>
            <p>{comment.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Task;
