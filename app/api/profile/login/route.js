import { NextResponse } from "next/server";
import { authorize } from "@/app/api/utils";
import { ENDPOINTS } from "@/app/api/config";

export async function POST(request) {
    const response = await authorize(ENDPOINTS.auth, await request.json());
    if (!response) {
      return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
    if (!response.profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }
    
    return NextResponse.json(response);
  }