import { Client, Intents, Permissions, APIMessage, Message } from "discord.js";
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const client = new Client({
  ws: {
    // GUILDSはキャッシュのために必要
    intents: Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES,
  },
  partials: ["GUILD_MEMBER", "USER"],
});
const permissions = new Permissions(["VIEW_CHANNEL", "SEND_MESSAGES"]);
/**
 * メッセージハンドラ
 * @param message
 */
async function onMessage(message: Message) {
  if (message.webhookID || message.author.bot) {
    return;
  }
  if (message.content !== "!ping") {
    return;
  }
  const reply = new APIMessage(message.channel, {
    content: "pong!",
  });
  reply.resolveData();
  // eslint-disable-next-line
  (reply.data as any).message_reference = { message_id: message.id };
  await message.channel.send(reply);
}
client.on("message", (message) => {
  onMessage(message).catch((err) => console.error(err));
});
client.once("ready", () => {
  // Client#userがnullになるのはready以前のみに限られるため
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const clientUser = client.user!;
  console.log(`Logged in as: ${clientUser.tag}#${clientUser.tag}`);
  console.log(
    `Invite Link: https://discord.com/api/oauth2/authorize?client_id=${clientUser.id}&permissions=${permissions.bitfield}&scope=bot`
  );
});
client.login(DISCORD_BOT_TOKEN).catch((err) => {
  console.error(err);
  process.exit(-1);
});
