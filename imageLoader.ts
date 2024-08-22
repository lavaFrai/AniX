"use client";

export default function imageLoader({ src, width, quality }) {
  return `https://wsrv.nl/?url=${src}&w=${width}&q=${quality || 75}`;
}
