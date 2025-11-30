import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import "./globals.scss";
import styles from "./layout.module.scss";

export const metadata = {
  title: "My Finance",
  description: "Personal finance budgeting app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <html lang="en">
      <body>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>My Finance</h1>
            {user && (
              <form action={signOut}>
                <button type="submit" className={styles.signOutButton}>
                  Sign out
                </button>
              </form>
            )}
          </div>
        </header>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}

