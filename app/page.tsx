import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignInForm from "@/components/SignInForm";
import styles from "./page.module.scss";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>My Finance</h1>
        <p className={styles.welcomeText}>Welcome, {user.email}</p>
        <div className={styles.buttonContainer}>
          <a href="/dashboard" className={styles.button}>
            Dashboard
          </a>
          <a href="/import" className={styles.button}>
            Import Transactions
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.landingContainer}>
      <h1 className={styles.landingTitle}>My Finance</h1>
      <SignInForm />
    </div>
  );
}

