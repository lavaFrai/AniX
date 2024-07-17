import { NextResponse } from "next/server";
import { fetchDataViaGet } from "../utils";
import { ENDPOINTS } from "../config";

export async function GET(request) {
  const page = parseInt(request.nextUrl.searchParams.get(["page"])) || 0;
  const token = request.nextUrl.searchParams.get(["token"]) || null;
  const sortName = request.nextUrl.searchParams.get(["sort"]) || "adding_descending";

  if (!token || token == "null") {
    return NextResponse.json({ message: "No token provided" }, { status: 403 });
  }

  let url = new URL(`${ENDPOINTS.user.history}/${page}`);
  url.searchParams.set("token", token);

  const response = await fetchDataViaGet(url.toString());
  return NextResponse.json(response);
}
