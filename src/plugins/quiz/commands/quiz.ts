/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { MessageEmbed, MessageReaction, User } from "discord.js";
import prettyMs from "pretty-ms";
import { colors } from "../../../constants/colors";
import { messages } from "../../../constants/messages";
import { bot } from "../../../main";
import { isProduction } from "../../../utils/isProduction";
import { stripIndents } from "../../../utils/stripIndents";
import QuizPlugin from "../plugin";

// constants used for game balacing
const numberOfQuestions = 3;
const expiresInterval = 1000 * 60 * 20; // Milliseconds * Seconds * Minutes

QuizPlugin.registerCommand({
  data: {
    // generateTranslation "plugin.quiz.command.quiz.name"
    name: "plugin.quiz.command.quiz.name",
    // generateTranslation "plugin.quiz.command.quiz.description"
    description: "plugin.quiz.command.quiz.description",
  },
  callback: async (interaction, locale) => {
    await interaction.deferReply({ ephemeral: true });

    if (!QuizPlugin.voucherData || QuizPlugin.voucherData?.length < 1 || !QuizPlugin.quizData) {
      return interaction.editReply(bot.i18n.__({ phrase: messages.COMMAND_INTERNAL_ERROR, locale }));
    }

    const sessionKey = `${QuizPlugin.quizData.name}-${interaction.user.id}`;

    if (isProduction()) {
      let existingSession = await QuizPlugin.store.get(sessionKey);
      if (existingSession) {
        return interaction.editReply("Scheinbar spielst du gerade eine Partie oder hast schon eine Partie gespielt.");
      }
    }

    interaction.editReply("Ich habe dir eine Privatnachricht geschickt, schau bitte in deine Privatnachrichten 🖖.");

    const voucherCode = QuizPlugin.voucherData.shift();

    if (!voucherCode) return interaction.editReply(bot.i18n.__({ phrase: messages.COMMAND_INTERNAL_ERROR, locale }));

    const questions = QuizPlugin.quizData.questions.sort(() => Math.random() - Math.random()).slice(0, numberOfQuestions);

    const filter = (reaction: MessageReaction, user: User) =>
      (reaction.emoji.name === "🇦" || reaction.emoji.name === "🇧" || reaction.emoji.name === "🇨") && user.id === interaction.user.id;

    let winning = true;
    let counter = 0;

    try {
      await interaction.user.send({
        embeds: [
          new MessageEmbed({
            footer: { text: `SessionId - ${sessionKey}` },
          })
            .setColor(colors.yellow)
            .setTitle(`${QuizPlugin.quizData.name} - das QuizPlugin!`)
            .setDescription(
              stripIndents(`
        Wie viel Geek steckt in dir? Zeig es uns und beantworte folgende Fragen rund um Filme, Serien, Bücher, Rollen-/Brettspiele und weitere absolut relevante Themen des Geek Daseins.

        Wenn du drei Fragen innerhalb von ${prettyMs(
          expiresInterval,
        )} richtig beantwortest, erhältst du sofort einen 20% Rabattcode für den Pegasus Spiele Onlineshop [LINK] - einlösbar bis 31. März auf alle sofort lieferbaren, nicht preisgebundenen Artikel. Gleichzeitig ist es uns eine Herzensangelegenheit diejenigen zu unterstützen, die vor dem Krieg in der Ukraine flüchten müssen. Daher spenden wir 20% des so erzielten Umsatzes an das Aktionsbündnis Katastrophenhilfe zugunsten der Ukraine-Nothilfe.
        
        Um die Fragen zu beantworten, klicke auf A, B oder C unterhalb der jeweiligen Frage.
        
        Viel Erfolg! :four_leaf_clover:
      `) as string,
            )
            .setTimestamp(),
        ],
      });
    } catch {
      return interaction.editReply(bot.i18n.__({ phrase: messages.CANT_SEND_PRIVATE_MESSAGE, locale }));
    }

    QuizPlugin.store.set(sessionKey, {
      running: true,
    });

    for (const [index, question] of questions.entries()) {
      const quizEmbed = new MessageEmbed()
        .setColor(colors.blurple)
        .addField(`Frage ${index + 1} von ${numberOfQuestions}`, question.question)
        .addField("🇦 - " + question.answers[0], "-----")
        .addField("🇧 - " + question.answers[1], "-----")
        .addField("🇨 - " + question.answers[2], "-----")
        .setTimestamp();

      if (!isProduction()) quizEmbed.addField("Richtige Antwort", ["🇦", "🇧", "🇨"][question.correctIndex]);

      const runningQuizPlugin = await interaction.user.send({ embeds: [quizEmbed] });
      runningQuizPlugin.react("🇦");
      runningQuizPlugin.react("🇧");
      runningQuizPlugin.react("🇨");

      runningQuizPlugin.awaitReactions({ filter, max: 1, time: expiresInterval }).then(async (collected) => {
        if (collected.size === 0) return;

        const array = ["🇦", "🇧", "🇨"];
        const correctAnswer = array[question.correctIndex];

        const answerEmoji = collected.first()?.emoji.name;

        if (answerEmoji !== correctAnswer) {
          winning = false;
        }

        counter++;

        if (counter === numberOfQuestions) {
          if (winning) {
            interaction.user.send(
              stripIndents(`
              Herzlichen Glückwunsch, du hast alle drei Fragen richtig beantwortet!

              Dein Gutscheincode lautet *${voucherCode.code}*. Du kannst ihn ab sofort und bis spätestens 31.3.2022 unter www.pegasusshop.de einlösen und erhältst dann sofort 20% Rabatt auf deine Bestellung sofort lieferbarer, nicht preisgebundener Artikel. 
                          
              Falls du regelmäßige Updates zu Aktionen wie dieser, aber auch zu Events und Angeboten erhalten möchtest, dann abonniere jetzt unseren Newsletter auf www.pegasus.de/newsletter. Schau außerdem auf www.conspiracy-con.de vorbei und entdecke die anderen CONspiracy-Aktionen!
                          
              Dein Pegabot :robot:     `),
            );
            QuizPlugin.store.set(sessionKey, {
              running: false,
              won: true,
              voucher: voucherCode,
            });
            QuizPlugin.store.set(`used-voucher-${voucherCode.code}`, true);
          } else {
            interaction.user.send(
              stripIndents(
                `
                Vielen Dank fürs Mitmachen! :clap:
              
                Leider waren jedoch eine oder mehrere deiner Antworten nicht korrekt. Versuche es noch einmal :wink:
                
                Du möchtest regelmäßig die neuesten Updates zu unseren Events, Aktionen und Angeboten erhalten? Dann abonniere unseren Newsletter unter https://pegasus.de/newsletter 
                
                Dein Pegabot :robot:
                `,
              ),
            );
            QuizPlugin.store.set(sessionKey, {
              running: false,
              won: false,
            });

            // session was not won by the user so we need to push the voucher back to the voucher pool
            QuizPlugin.voucherData?.push(voucherCode);
          }
        }
      });
    }
  },
});
