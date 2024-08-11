import { NextResponse } from "next/server";
import * as fs from "node:fs";
import * as path from "node:path";

export async function GET() {
  const directoryPath = path.join(process.cwd(), "public/changelog");
  const files = fs.readdirSync(directoryPath);
  const current = "3.0.1";
  const previous = [];
  files.forEach((file) => {
    if (file != `${current}.md`) {
      previous.push(file.replace(".md", ""));
    }
  });

  return NextResponse.json({ version: current, previous: previous });
}
