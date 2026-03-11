import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { productId, action, quantity } = await req.json();

  if (!productId || !action || !quantity) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    // Replace with real Shopline API call later
    // Dummy logic for now
    let newStock = 42;
    if (action === "add") newStock = 42 + quantity;
    if (action === "deduct") newStock = 42 - quantity;
    if (action === "update") newStock = quantity;

    return NextResponse.json({ newStock });

  } catch {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
