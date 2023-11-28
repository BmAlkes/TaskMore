import Image from "next/image";
import styles from "./home.module.css";
import heroImg from "../../../public/undraw_dashboard_re_3b76.svg";
import Head from "next/head";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image className={styles.hero} alt="logo" src={heroImg} priority />
        </div>
        <h1 className={styles.title}>
          System made for you to organize <br /> your studies and tasks
        </h1>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+12 posts</span>
          </section>
          <section className={styles.box}>
            <span>+12 posts</span>
          </section>
        </div>
      </main>
    </div>
  );
}
