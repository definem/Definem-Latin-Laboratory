import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const send = async (chat_id, text) => {
  const r = await fetch(
    `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text }),
    },
  );
  console.log("TG javob:", r.status);
};

const dayStr = (offset = 0) =>
  new Date(Date.now() + 5 * 3600 * 1000 - offset * 86400000)
    .toISOString()
    .slice(0, 10);

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

    const msg = req.body?.message;
    if (!msg) return res.status(200).end();

    if (String(msg.chat.id) !== String(process.env.TG_CHAT_ID)) {
      await send(msg.chat.id, `Ruxsat yo'q. Sizning chat ID: ${msg.chat.id}`);
      return res.status(200).end();
    }

    const text = (msg.text || "").trim();
    if (text === "/stats" || text === "/start") {
      const lines = [];
      let totalUniq = 0,
        totalViews = 0;
      for (let i = 0; i < 7; i++) {
        const d = dayStr(i);
        const views = Number((await redis.get(`views:${d}`)) || 0);
        const uniq = await redis.scard(`uniq:${d}`);
        totalUniq += uniq;
        totalViews += views;
        lines.push(`${i === 0 ? "Bugun" : d}: ${uniq} odam / ${views} tashrif`);
      }
      await send(
        msg.chat.id,
        `📊 Oxirgi 7 kun\n\n${lines.join("\n")}\n\nJami: ${totalUniq} odam / ${totalViews} tashrif`,
      );
    }

    return res.status(200).end();
  } catch (e) {
    console.log(e);
    return res.status(200).send("XATO: " + e.message);
  }
}
