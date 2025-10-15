import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { isR2Configured, uploadToR2 } from "@/lib/r2";

const MAX_UPLOAD_SIZE = 1_048_576; // 1MB
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function POST(request: Request) {
  if (!isR2Configured()) {
    return NextResponse.json(
      {
        error:
          "Image uploads are not enabled. Please contact support to configure Cloudflare R2.",
      },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Upload request is missing an image file." },
      { status: 400 }
    );
  }

  const extension = getExtension(file.name, file.type);
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      {
        error:
          "Unsupported image type. Please upload a PNG, JPEG, or WebP image.",
      },
      { status: 415 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_UPLOAD_SIZE) {
    return NextResponse.json(
      { error: "Image is too large. Please upload a file under 1MB." },
      { status: 413 }
    );
  }

  const buffer = Buffer.from(arrayBuffer);
  const key = `submissions/${new Date()
    .toISOString()
    .slice(0, 10)}/${randomUUID()}${extension}`;

  try {
    const { url } = await uploadToR2({
      key,
      body: buffer,
      contentType: file.type,
    });
    return NextResponse.json({ success: true, url, key });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[uploads] failed to upload to R2", error);
    }
    return NextResponse.json(
      { error: "We couldn’t upload the image right now. Please try again." },
      { status: 500 }
    );
  }
}

function getExtension(filename: string, mimeType: string): string {
  const fromName = filename?.includes(".")
    ? `.${filename.split(".").pop()?.toLowerCase()}`
    : "";
  if (fromName) {
    return fromName.startsWith(".") ? fromName : `.${fromName}`;
  }

  switch (mimeType) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpg";
    case "image/webp":
      return ".webp";
    default:
      return "";
  }
}
