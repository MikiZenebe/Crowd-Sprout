import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import { PinataSDK } from "pinata";

type Bindings = {
  PINATA_JWT?: string;
  GATEWAY_URL?: string;
  [key: string]: unknown;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/presigned_url", async (c) => {
  const envVars = env<Bindings>(c);
  const nodeEnv = (
    globalThis as unknown as {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process?.env;

  const pinataJwt =
    (envVars.PINATA_JWT as string | undefined) ||
    (c.env?.PINATA_JWT as string | undefined) ||
    nodeEnv?.PINATA_JWT;

  const pinataGateway =
    (envVars.GATEWAY_URL as string | undefined) ||
    (c.env?.GATEWAY_URL as string | undefined) ||
    nodeEnv?.GATEWAY_URL;

  if (!pinataJwt) {
    return c.json(
      {
        error:
          "PINATA_JWT is not configured. Please add PINATA_JWT in your Vercel Project Settings > Environment Variables.",
      },
      500,
    );
  }

  try {
    const pinata = new PinataSDK({
      pinataJwt,
      pinataGateway,
    });

    const url = await pinata.upload.public.createSignedURL({
      expires: 60, // Last for 60 seconds
    });

    return c.json({ url }, { status: 200 });
  } catch (error: unknown) {
    console.error("Failed to create signed URL:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create signed URL";
    return c.json({ error: message }, 500);
  }
});

export default app;
