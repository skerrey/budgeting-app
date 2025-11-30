"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error || "Failed to import transactions"}`);
      } else {
        setMessage(`Successfully imported ${data.imported} transactions!`);
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById("file-input") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Import Transactions</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label htmlFor="file-input" style={{ display: "block", marginBottom: "0.5rem" }}>
            Select CSV file (QFX/OFX coming soon)
          </label>
          <input
            id="file-input"
            type="file"
            name="file"
            accept=".csv,.qfx,.ofx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !file}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: loading || !file ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading || !file ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Importing..." : "Import"}
        </button>
        {message && (
          <p
            style={{
              color: message.includes("Error") ? "#d32f2f" : "#2e7d32",
              marginTop: "0.5rem",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

