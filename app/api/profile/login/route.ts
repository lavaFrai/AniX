import { NextResponse, NextRequest } from "next/server";
import { authorize } from "#/api/utils";
import { API_URL } from "#/api/config";

export async function POST(request: NextRequest) {
  const response = await authorize(`${API_URL}/auth/signIn`, await request.json());
  if (!response) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
  if (!response.profile) {
    return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  }
  return NextResponse.json(response);
}
