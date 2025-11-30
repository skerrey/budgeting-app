import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import "./globals.css";

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
        <header style={{ padding: "1rem 2rem", borderBottom: "1px solid #e0e0e0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ margin: 0, fontSize: "1.5rem" }}>My Finance</h1>
            {user && (
              <form action={signOut}>
                <button
                  type="submit"
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Sign out
                </button>
              </form>
            )}
          </div>
        </header>
        <main style={{ padding: "2rem" }}>{children}</main>
      </body>
    </html>
  );
}

