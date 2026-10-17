import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

const send = async (chat_id, text) => {
  const r = await fetch(
    `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text }),
    },
  );
  console.log("TG javob:", r.status, await r.text());
};

const dayStr = (offset = 0) =>
  new Date(Date.now() + 5 * 3600 * 1000 - offset * 86400000)
    .toISOString()
    .slice(0, 10);

console.log("Keldi:", JSON.stringify(req.body));

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      await redis.set("ping", "ok");
      return res
        .status(200)
        .send(
          "redis ok | TG_CHAT_ID: " + (process.env.TG_CHAT_ID ? "bor" : "YO'Q"),
        );
    }

  } catch (e) {
    console.log(e);
    return res.status(200).send("XATO: " + e.message);
  }
}
