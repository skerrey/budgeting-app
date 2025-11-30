"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

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
    <div className={styles.container}>
      <h1 className={styles.title}>Import Transactions</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="file-input">Select CSV file (QFX/OFX coming soon)</label>
          <input
            id="file-input"
            type="file"
            name="file"
            accept=".csv,.qfx,.ofx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <button type="submit" disabled={loading || !file} className={styles.submitButton}>
          {loading ? "Importing..." : "Import"}
        </button>
        {message && (
          <p
            className={`${styles.message} ${
              message.includes("Error") ? styles.error : styles.success
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

