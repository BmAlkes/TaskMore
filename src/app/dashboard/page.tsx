"use client";
import React, { useEffect } from "react";
import styles from "./styles.module.css";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import TextArea from "@/components/textArea";

const Dashboard = () => {
  const { data: session } = useSession();
  useEffect(() => {
    if (!session?.user) {
      redirect("/");
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>My Panel</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={`${styles.title} text-3xl`}>What is your task?</h1>
            <form>
              <TextArea placeholder="Type yout task..." />
              <div className={styles.checkboxArea}>
                <input type="checkbox" className={styles.checkbox} />
                <label>Turn an public task?</label>
              </div>
              <button className={styles.button} type="submit">
                Register
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
