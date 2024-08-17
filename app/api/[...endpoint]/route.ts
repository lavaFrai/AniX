import { NextResponse, NextRequest } from "next/server";
import { fetchDataViaGet, fetchDataViaPost } from "../utils";
import { API_URL } from "../config";
import { buffer } from "stream/consumers";

export async function GET(
  req: NextRequest,
  { params }: { params: { endpoint: Array<string> } }
) {
  const { endpoint } = params;
  let API_V2: boolean | string =
    req.nextUrl.searchParams.get("API_V2") || false;
  if (API_V2 === "true") {
    req.nextUrl.searchParams.delete("API_V2");
  }
  const query = req.nextUrl.searchParams.toString();
  const url = `${API_URL}/${endpoint.join("/")}${query ? `?${query}` : ""}`;

  const response = await fetchDataViaGet(url, API_V2);
  return NextResponse.json(response);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { endpoint: Array<string> } }
) {
  const { endpoint } = params;
  let API_V2: boolean | string =
    req.nextUrl.searchParams.get("API_V2") || false;
  if (API_V2 === "true") {
    req.nextUrl.searchParams.delete("API_V2");
  }
  const query = req.nextUrl.searchParams.toString();
  const url = `${API_URL}/${endpoint.join("/")}${query ? `?${query}` : ""}`;
  let body;
  const ReqContentTypeHeader = req.headers.get("Content-Type") || "";
  let ResContentTypeHeader = "";

  if (ReqContentTypeHeader.split(";")[0] == "multipart/form-data") {
    ResContentTypeHeader = ReqContentTypeHeader;
    body = await req.arrayBuffer();
  } else {
    ResContentTypeHeader = "application/json; charset=UTF-8";
    body = JSON.stringify(await req.json());
  }

  const response = await fetchDataViaPost(url, body, API_V2, ResContentTypeHeader);
  return NextResponse.json(response);
}
