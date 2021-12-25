/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import {
  ApplicationCommandChoicesOption,
  ApplicationCommandData,
  ApplicationCommandPermissionData,
  ChatInputApplicationCommandData,
  Collection,
  Guild,
  GuildApplicationCommandPermissionData,
  OAuth2Guild,
} from "discord.js";
import { getRolesByPermissionsAndGuild } from "../../utils/getRolesByPermissionsAndGuild";
import { getGuildLocale } from "../../utils/guildLocale";
import { Bot } from "../bot";
import { BotCommand } from "../structures/BotCommand";

export class InteractionManager {
  // this holds all the commands and their aliases and the ids which get returned by the API
  commands: Collection<string, BotCommand> = new Collection();
  // this holds all the command callbacks index by their aliases
  commandCallbacks: Collection<string, BotCommand["callback"]> = new Collection();

  constructor(private bot: Bot) {}

  register(command: BotCommand) {
    this.bot.logger.info(`registering command (${command.data.name})`);

    // if we have a specific permission set, we need to disable the command for all users
    if (command.data.permissions) command.data.defaultPermission = false;

    // we need to initialize the ids collection and the alias array
    command.ids = new Collection();
    command.alias = [];

    // store the command internally
    this.commands.set(command.data.name, command);
  }

  async deploy(guildID?: string): Promise<any> {
    // if we have a guilID we want to deploy to this guild only
    // then we try to get the guild(s) from cache first.
    // if guilds are not present in cache, fetch from API.
    let guilds: Guild[] | OAuth2Guild[] = [];
    if (guildID) {
      // we have a guilID and we want to deploy to this guild only
      let guild = this.bot.client.guilds.cache.get(guildID);

      if (guild) {
        // we found the guild in our cache
        guilds = [guild];
      } else {
        // the guild is not in the cache, fetching from API
        guilds = [await this.bot.client.guilds.fetch(guildID)];
      }

      this.bot.logger.info(`deploying ${this.commands.size} commands on guild (${guilds[0].name})`);
    } else {
      // we want to deploy to all guilds we are a member of
      guilds = [...this.bot.client.guilds.cache.values()];

      if (!guilds || guilds.length < 1) {
        // the guild is not in the cache, fetching from API
        guilds = [...(await this.bot.client.guilds.fetch()).values()];
      }

      this.bot.logger.info(`deploying ${this.commands.size} commands on ${guilds.length} guild(s)`);
    }

    // we need to set a callback for every translation of the command name
    this.commands.forEach((command) => {
      this.bot.i18n.getLocales().forEach((locale) => {
        const name = this.bot.i18n.__({ phrase: command.data.name, locale });
        if (!this.commands.get(command.data.name)?.alias?.includes(name)) command.alias?.push(name);
        if (!this.commandCallbacks.has(name)) this.commandCallbacks.set(name, command.callback);
      });
    });

    // deploy the commands on the guilds(s)
    await Promise.all(
      guilds.map(async (guild) => {
        return new Promise(async (resolve, reject) => {
          const locale = await getGuildLocale(guild.id);

          // transalate the data from all commands with the locale of the guild
          const data = this.localizeCommandData(
            [...this.commands.values()].map(({ data }) => data),
            locale,
          );

          // we need to store the id of the commands returned by the API
          const createdCommands = await (guild as Guild)?.commands.set(data);
          createdCommands.forEach((createdCommand) => {
            const command = this.commands.find((command) => command.alias?.includes(createdCommand.name) || false);
            if (!command) return;
            command.ids?.set(guild.id, createdCommand.id);
          });
          resolve(true);
        });
      }),
    );

    // we deployed the commands and stored their IDs in a map index
    // by their guildID => let's deploy the permissions on the guilds
    return this.deployPermissions(guilds as Guild[]);
  }

  private async deployPermissions(guilds: Guild[]): Promise<any> {
    // we have to deploy the permissions for every guild separately because
    // we only use guild specific commands
    guilds.forEach(async (guild) => {
      let fullPermissions: GuildApplicationCommandPermissionData[] = [];

      try {
        this.commands.forEach(({ ids, data }) => {
          // if the command has no permissions set or the id of the
          // command returned by the API is undefined go
          // to the next command
          if (!data.permissions || data.permissions.length < 1) return;
          const id = ids?.get(guild.id);
          if (!id) return;

          this.bot.logger.info(`deploying permissions (${data.permissions.join(", ")}) for command (${data.name}) on guild (${guild.name})`);

          let permissions: ApplicationCommandPermissionData[] = [];

          // get the roles from the guild related to the set permissions
          const RolesByPermissions = getRolesByPermissionsAndGuild(guild, data.permissions);

          // set up the data structure which is expected by the API
          permissions = permissions.concat(
            RolesByPermissions.sort((a, b) => b.position - a.position)
              .slice(0, 10)
              .map((role) => {
                return {
                  id: role.id,
                  type: "ROLE",
                  permission: true,
                };
              }),
          );

          fullPermissions.push({
            id,
            permissions: permissions,
          });
        });

        // deploy the permissions on the guild
        await guild.commands.permissions.set({ fullPermissions });
      } catch (error: any) {
        this.bot.logger.error((error as Error).message);
      }
    });
  }

  private localizeCommandData(data: ApplicationCommandData[], locale: string): ApplicationCommandData[] {
    // this function takes the command data that will be send via API and translates all the text fields
    // the user will see
    const localized: ApplicationCommandData[] = data.map((d) => {
      return {
        ...d,
        name: this.bot.i18n.__({ phrase: d.name, locale }),
        description: (d as ChatInputApplicationCommandData).description
          ? this.bot.i18n.__({ phrase: (d as ChatInputApplicationCommandData).description, locale })
          : "",
        options: (d as ChatInputApplicationCommandData).options
          ? (d as ChatInputApplicationCommandData).options?.map((option) => {
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
