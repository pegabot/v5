import { bot } from "../../main";
import { getUserList } from "../../studip/bridge";

bot.regsisterCommand(
  {
    name: "search",
    type: "CHAT_INPUT",
    description: "Suche nach einer Person auf Stud.Ip",
    options: [{ type: "STRING", name: "name", description: "Wie lautete die Person, nach welcher du suchst?", required: true }],
  },
  async (interaction) => {
    interaction.deferReply();
    const name = interaction.options.getString("name");

    if (!name) return interaction.reply("Es gab einen Fehler, versuche es erneut!");

    const list = await getUserList(name);

    if (!list) return interaction.reply("Die Person konnte nicht gefunden werden!");

    interaction.editReply({ files: [list[1]] });
  },
);
