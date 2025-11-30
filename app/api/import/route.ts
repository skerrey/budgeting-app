import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Get file extension
    const fileName = file.name.toLowerCase();
    const extension = fileName.substring(fileName.lastIndexOf("."));

    // Handle CSV files
    if (extension === ".csv") {
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());

      if (lines.length < 2) {
        return NextResponse.json({ error: "CSV file must have at least a header and one data row" }, { status: 400 });
      }

      // Parse header
      const headerLine = lines[0].trim();
      const headers = headerLine.split(",").map((h) => h.trim().toLowerCase());

      // Find column indices
      const dateIndex = headers.findIndex((h) => h === "date");
      const descriptionIndex = headers.findIndex((h) => h === "description");
      const amountIndex = headers.findIndex((h) => h === "amount");

      if (dateIndex === -1 || descriptionIndex === -1 || amountIndex === -1) {
        return NextResponse.json(
          {
            error: "CSV must have 'date', 'description', and 'amount' columns (case-insensitive)",
          },
          { status: 400 }
        );
      }

      // Parse data rows
      const transactions = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV parsing (handles quoted values)
        const values: string[] = [];
        let current = "";
        let inQuotes = false;

        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            values.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        values.push(current.trim());

        if (values.length <= Math.max(dateIndex, descriptionIndex, amountIndex)) {
          continue; // Skip malformed rows
        }

        const dateStr = values[dateIndex];
        const description = values[descriptionIndex];
        const amountStr = values[amountIndex];

        // Parse date (try multiple formats)
        let date: Date;
        try {
          date = new Date(dateStr);
          if (isNaN(date.getTime())) {
            continue; // Skip invalid dates
          }
        } catch {
          continue; // Skip invalid dates
        }

        // Parse amount
        const amount = parseFloat(amountStr.replace(/[^0-9.-]/g, ""));
        if (isNaN(amount)) {
          continue; // Skip invalid amounts
        }

        transactions.push({
          user_id: user.id,
          date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
          description: description || "",
          amount: amount.toFixed(2),
        });
      }

      if (transactions.length === 0) {
        return NextResponse.json({ error: "No valid transactions found in CSV" }, { status: 400 });
      }

      // Insert transactions
      const { error: insertError } = await supabase.from("transactions").insert(transactions);

      if (insertError) {
        console.error("Error inserting transactions:", insertError);
        return NextResponse.json({ error: "Failed to insert transactions" }, { status: 500 });
      }

      return NextResponse.json({ imported: transactions.length });
    }

    // Handle QFX/OFX files (stub)
    if (extension === ".qfx" || extension === ".ofx") {
      return NextResponse.json(
        { error: "QFX/OFX import not implemented yet" },
        { status: 501 }
      );
    }

    return NextResponse.json(
      { error: `Unsupported file type: ${extension}. Supported: .csv, .qfx, .ofx` },
      { status: 400 }
    );
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

