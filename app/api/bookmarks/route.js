import { NextResponse } from "next/server";
import { fetchDataViaGet } from "../utils";
import { ENDPOINTS } from "../config";

const list = {
  watching: 1,
  planned: 2,
  watched: 3,
  delayed: 4,
  abandoned: 5,
};

const sort = {
  adding_descending: 1,
  adding_ascending: 2,
  // year_descending: 3,
  // year_ascending: 4,
  alphabet_descending: 5,
  alphabet_ascending: 6,
};

export async function GET(request) {
  const page = parseInt(request.nextUrl.searchParams.get(["page"])) || 0;
  const listName = request.nextUrl.searchParams.get(["list"]) || null;
  const token = request.nextUrl.searchParams.get(["token"]) || null;
  const sortName = request.nextUrl.searchParams.get(["sort"]) || "adding_descending";

  if (!token || token == "null") {
    return NextResponse.json({ message: "No token provided" }, { status: 403 });
  }

  if (!listName || listName == "null") {
    return NextResponse.json({ message: "No list provided" }, { status: 400 });
  }

  if (!list[listName]) {
    return NextResponse.json({ message: "Unknown list" }, { status: 400 });
  }

  if (!sort[sortName]) {
    return NextResponse.json({ message: "Unknown sort" }, { status: 400 });
  }

  let url = new URL(`${ENDPOINTS.user.bookmark}/${list[listName]}/${page}`);
  url.searchParams.set("token", token);
  url.searchParams.set("sort", sort[sortName]);

  const response = await fetchDataViaGet(url.toString());
  return NextResponse.json(response);
}
