"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Check your email for the magic link!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          padding: "0.75rem",
          fontSize: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Sending..." : "Sign in"}
      </button>
      {message && (
        <p style={{ color: message.includes("Error") ? "#d32f2f" : "#2e7d32", marginTop: "0.5rem" }}>
          {message}
        </p>
      )}
    </form>
  );
}

