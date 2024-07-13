import { NextResponse } from "next/server";
import { fetchDataViaGet } from "@/app/api/utils";
import { ENDPOINTS } from "@/app/api/config";

export async function GET(request, params) {
  const token = request.nextUrl.searchParams.get(["token"]) || null;
  let url = new URL(`${ENDPOINTS.profile}/${params["params"]["id"]}`);
  if (token) {
    url.searchParams.set("token", token);
  }

  const response = await fetchDataViaGet(url.toString());
  if (!response) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
  if (!response.profile) {
    return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(response);
}
