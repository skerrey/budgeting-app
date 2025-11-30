import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import styles from "./page.module.scss";

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
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      {transactions && transactions.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th className={styles.amountHeader}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td
                  className={`${styles.amountCell} ${
                    parseFloat(transaction.amount) >= 0 ? styles.positive : styles.negative
                  }`}
                >
                  ${parseFloat(transaction.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.emptyMessage}>
          No transactions yet. Import some transactions to get started!
        </p>
      )}
    </div>
  );
}

