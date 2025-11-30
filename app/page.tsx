import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignInForm from "@/components/SignInForm";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "1rem" }}>My Finance</h1>
        <p style={{ marginBottom: "2rem" }}>Welcome, {user.email}</p>
        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
          <a
            href="/dashboard"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#0070f3",
              color: "white",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            Dashboard
          </a>
          <a
            href="/import"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#0070f3",
              color: "white",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            Import Transactions
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ marginBottom: "2rem" }}>My Finance</h1>
      <SignInForm />
    </div>
  );
}

