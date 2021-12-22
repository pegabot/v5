/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandChoicesOption, ApplicationCommandData, ChatInputApplicationCommandData, CommandInteraction, Guild, OAuth2Guild } from "discord.js";
import { getGuildLocale } from "../../utils/guildLocale";
import { Bot } from "../bot";
import { BotCommand } from "../structures/BotCommand";

export class InteractionManager {
  commands: Array<BotCommand> = new Array();
  commandCallbacks: Map<string, BotCommand["callback"]> = new Map();

  constructor(private bot: Bot) {}

  register(command: ApplicationCommandData, callback: (interaction: CommandInteraction, locale: string) => Promise<void>) {
    this.bot.logger.info(`registering command (${command.name})`);

    //register the command
    this.commands.push({ command, callback });
  }

  async deploy(guildID?: string): Promise<[void]> {
    // if we have a guilID we want to the server with the id = guildID only
    // then we get the guilds from cache first.
    // If guilds are not present fetch from API.
    let guilds: Guild[] | OAuth2Guild[] = [];
    if (guildID) {
      let guild = this.bot.client.guilds.cache.get(guildID);
      if (guild) {
        guilds = [guild];
      } else {
        guilds = [await this.bot.client.guilds.fetch(guildID)];
      }

      this.bot.logger.info(`deploying ${this.commands.length} commands on server (${guilds[0].name})`);
    } else {
      guilds = [...this.bot.client.guilds.cache.values()];

      if (!guilds || guilds.length < 1) {
        guilds = [...(await this.bot.client.guilds.fetch()).values()];
      }

      this.bot.logger.info(`deploying ${this.commands.length} commands on ${guilds.length} servers`);
    }

    this.commands.forEach((c) => {
      this.bot.i18n.getLocales().forEach((locale) => {
        const name = this.bot.i18n.__({ phrase: c.command.name, locale });
        if (this.commandCallbacks.has(name)) return;
        this.commandCallbacks.set(name, c.callback);
      });
    });

    //deploy the commands on all servers the bot is a member of
    return await Promise.all([
      guilds.forEach(async (guild) => {
        const locale = await getGuildLocale(guild.id);

        const data = this.localizeCommandData(
          this.commands.map((e) => e.command),
          locale,
        );

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
