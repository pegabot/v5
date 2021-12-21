/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import {
  ApplicationCommandChoicesOption,
  ApplicationCommandData,
  ChatInputApplicationCommandData,
  Collection,
  CommandInteraction,
  Guild,
  OAuth2Guild,
} from "discord.js";
import { BotCommand } from "../../structures/BotCommand";
import { Bot } from "../bot";
import { getGuildLocale } from "../utils/guildLocale";

export class InteractionManager {
  commands: Array<BotCommand> = new Array();
  commandCallbacks: Map<string, BotCommand["callback"]> = new Map();

  constructor(private bot: Bot) {}

  register(command: ApplicationCommandData, callback: (interaction: CommandInteraction, locale: string) => Promise<void>) {
    this.bot.logger.info(`registering command (${command.name})`);

    //register the command
    this.commands.push({ command, callback });
  }

  async publish() {
    // get guilds from cache first. If guilds are not present fetch from API.
    let guilds: Collection<string, Guild | OAuth2Guild> = this.bot.client.guilds.cache;

    if (!guilds || guilds.size < 1) {
      guilds = await this.bot.client.guilds.fetch();
    }

    this.bot.logger.info(`publishing ${this.commands.length} commands on ${guilds.size} servers`);

    this.commands.forEach((c) => {
      this.bot.i18n.getLocales().forEach((locale) => {
        const name = this.bot.i18n.__({ phrase: c.command.name, locale });
        if (this.commandCallbacks.has(name)) return;
        this.commandCallbacks.set(name, c.callback);
      });
    });

    //publish the commands on all servers the bot is a member of
    return await Promise.all([
      guilds.forEach(async (guild) => {
        const locale = await getGuildLocale(guild.id);

        const data = this.localizeCommandData(
          this.commands.map((e) => e.command),
          locale,
        );

        this.bot.logger.info(guild.name, data);

        await (guild as Guild)?.commands.set(data);
      }),
    ]);
  }

  private localizeCommandData(commands: ApplicationCommandData[], locale: string): ApplicationCommandData[] {
    const localized: ApplicationCommandData[] = commands.map((command) => {
      return {
        ...command,
        name: this.bot.i18n.__({ phrase: command.name, locale }),
        description: (command as ChatInputApplicationCommandData).description
          ? this.bot.i18n.__({ phrase: (command as ChatInputApplicationCommandData).description, locale })
          : "",
        options: (command as ChatInputApplicationCommandData).options
          ? (command as ChatInputApplicationCommandData).options?.map((option) => {
              return {
                ...option,
                name: this.bot.i18n.__({ phrase: option.name, locale }),
                description: this.bot.i18n.__({ phrase: option.description, locale }),
                choices: (option as ApplicationCommandChoicesOption).choices?.map((choice) => {
                  return {
                    ...choice,
                    name: this.bot.i18n.__({ phrase: choice.name, locale }),
                  };
                }),
              };
            })
          : [],
      };
    });

    return localized;
  }
}
