import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const isbn = req.nextUrl.searchParams.get("isbn");

  if (!isbn) {
    return NextResponse.json({ message: "ISBN is required" }, { status: 400 });
  }

  try {
    // Replace this with real Shopline API call later
    // const res = await fetch(`https://shopline-api.com/products?isbn=${isbn}`, {
    //   headers: { Authorization: `Bearer ${process.env.SHOPLINE_API_KEY}` }
    // });

    // ✅ Dummy response for testing UI right now
    return NextResponse.json({
      id: "prod_001",
      name: "Test Product - " + isbn,
      isbn: isbn,
      image: "",
      stock: 42,
      sku: "SKU-" + isbn,
    });

  } catch {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
}
