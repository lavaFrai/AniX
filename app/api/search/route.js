import { NextResponse } from "next/server";
import { fetchDataViaPost } from "../utils";
import { ENDPOINTS } from "../config";

export async function GET(request) {
  const page = parseInt(request.nextUrl.searchParams.get(["page"])) || 0;
  const query = request.nextUrl.searchParams.get(["q"]) || null;
  const token = request.nextUrl.searchParams.get(["token"]) || null;
  if (token) {
    url.searchParams.set("token", token);
  }
  const data = { query, searchBy: 0 };
  let url = new URL(`${ENDPOINTS.search}/${page}`);

  const response = await fetchDataViaPost(url.toString(), data);
  if (!response) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  return NextResponse.json(response);
}
