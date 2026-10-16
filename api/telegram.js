import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

const send = (chat_id, text) =>
  fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text }),
  });

const dayStr = (offset = 0) =>
  new Date(Date.now() + 5 * 3600 * 1000 - offset * 86400000)
    .toISOString()
    .slice(0, 10);

export default async function handler(req, res) {
  const msg = req.body?.message;
    if (!msg) return res.status(200).end();

    if (String(msg.chat.id) !== String(process.env.TG_CHAT_ID)) {
      await send(
        msg.chat.id,
        `Ruxsat yo'q. Sizning chat ID: ${msg.chat.id}\nVercel'dagi TG_CHAT_ID: ${process.env.TG_CHAT_ID ? "o'rnatilgan" : "YO'Q"}`,
      );
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

  res.status(200).end();
}
