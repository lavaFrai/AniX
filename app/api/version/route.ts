import { NextResponse } from "next/server";
import * as fs from "node:fs";
import * as path from "node:path";

export async function GET() {
  const directoryPath = path.join(process.cwd(), "public/changelog");
  const files = fs.readdirSync(directoryPath);
  const current = "3.1.0";
  const previous = [];
  files.forEach((file) => {
    if (file != `${current}.md`) {
      previous.push(file.replace(".md", ""));
    }
  });

  function compare(a: string, b: string) {
    const aElement = a.split(".");
    const bElement = b.split(".");

    const aLength = aElement.length;
    const bLength = bElement.length;

    let order = 0;

    for (let i = 0; i < Math.max(aLength, bLength); i++) {
      const aNum = Number(aElement[i] || 0);
      const bNum = Number(bElement[i] || 0);
      if (aNum !== bNum) {
        if (a > b) {
          order += -1;
        }
        if (a < b) {
          order += 1;
        }
      }
    }
    return order;
  }

  return NextResponse.json({
    version: current,
    previous: previous.sort(compare),
  });
}
