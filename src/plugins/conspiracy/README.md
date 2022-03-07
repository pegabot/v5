# Plugin: `CONspiracy`

This plugin contains all events, commands and tasks for the CONspiracy guild of Pegasus Spiele (see https://conspiracy-con.de for more information).

This plugin needs environmental variables:

Add this to your runtime envs and to the `.env` file in the root of this repository for development:
```
CONSPIRACY_GUILD_ID=<add the guildID of the CONspiracy guild here>
CONSPIRACY_ADMINCHANNEL_ID=<add the channel id of the admin channel of the CONspiracy guild here>
ROLLBUTLER_KEY=<add your Rollbutler API Key here>
ROLLBUTLER_PASS=<add your Rollbutler API Password here>
```

To enable this plugin you need to pass an argument `--CONspiracy`.
```
node . --CONspiracy
```