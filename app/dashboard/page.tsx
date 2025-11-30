import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Dashboard</h1>
      {transactions && transactions.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #e0e0e0",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #ccc" }}>
                Date
              </th>
              <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #ccc" }}>
                Description
              </th>
              <th style={{ padding: "0.75rem", textAlign: "right", borderBottom: "2px solid #ccc" }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td style={{ padding: "0.75rem" }}>
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td style={{ padding: "0.75rem" }}>{transaction.description}</td>
                <td
                  style={{
                    padding: "0.75rem",
                    textAlign: "right",
                    color: parseFloat(transaction.amount) >= 0 ? "#2e7d32" : "#d32f2f",
                  }}
                >
                  ${parseFloat(transaction.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions yet. Import some transactions to get started!</p>
      )}
    </div>
  );
}

