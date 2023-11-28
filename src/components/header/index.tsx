"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./styles.module.css";
import Link from "next/link";

export function Header() {
  const { data: session, status } = useSession();
  console.log(session);

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            <h1>
              Task <span>+</span>
            </h1>
          </Link>
          {session?.user && (
            <Link
              href="
          /dashboard"
              className={styles.link}
            >
              My Panel
            </Link>
          )}
        </nav>

        {status === "loading" ? (
          <></>
        ) : session ? (
          <button
            className={styles.loginButton}
            onClick={() => {
              signOut();
            }}
          >
            Hello {session.user?.name}
          </button>
        ) : (
          <button
            className={styles.loginButton}
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            Login
          </button>
        )}
      </section>
    </header>
  );
}
