import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";
const accountId = process.env.R2_ACCOUNT_ID ?? "";
const bucketName = process.env.R2_BUCKET_NAME ?? "";
const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL ?? "";

if (!accessKeyId || !secretAccessKey || !accountId || !bucketName || !publicBaseUrl) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[r2] Missing Cloudflare R2 environment variables. Uploads endpoint will be disabled until all variables are configured.",
    );
  }
}

const hasValidConfig = Boolean(
  accessKeyId && secretAccessKey && accountId && bucketName && publicBaseUrl,
);

const client = hasValidConfig
  ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  : null;

export async function uploadToR2(opts: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<{ url: string }> {
  if (!client || !hasValidConfig) {
    throw new Error("Cloudflare R2 is not configured. Please check environment variables.");
  }

  const { key, body, contentType } = opts;

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  const normalizedBase = publicBaseUrl.replace(/\/$/, "");
  const normalizedKey = key.replace(/^\//, "");

  return {
    url: `${normalizedBase}/${normalizedKey}`,
  };
}

export function isR2Configured() {
  return hasValidConfig;
}
