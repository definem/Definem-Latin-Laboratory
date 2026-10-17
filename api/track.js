import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const tashkentDay = () =>
  new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const ua = req.headers["user-agent"] || "";
  if (/bot|crawl|spider|preview/i.test(ua))
    return res.status(200).json({ ok: true });

  const { visitorId } = req.body || {};
  if (visitorId === "admin") return res.status(200).json({ ok: true });

  const day = tashkentDay();
  const TTL = 60 * 60 * 24 * 90;

  await redis.incr(`views:${day}`);
  const isNew = await redis.sadd(`uniq:${day}`, visitorId || "anon");
  await redis.expire(`views:${day}`, TTL);
  await redis.expire(`uniq:${day}`, TTL);

  if (isNew) {
    const country = req.headers["x-vercel-ip-country"] || "?";
    await fetch(
      `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TG_CHAT_ID,
          text: `👤 Yangi tashrif (${country})`,
        }),
      },
    );
  }

  res.status(200).json({ ok: true });
}
