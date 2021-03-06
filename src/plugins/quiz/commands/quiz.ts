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
      try {
        let existingSession = await QuizPlugin.store.get(sessionKey);
        if (existingSession) {
          if ((existingSession.hasOwnProperty("running") && existingSession.running) || (existingSession.hasOwnProperty("won") && existingSession.won)) {
            return interaction.editReply("Scheinbar spielst du gerade eine Partie oder hast schon eine Partie gespielt.");
          }
          await QuizPlugin.store.delete(sessionKey);
        }
      } catch (err) {
        await QuizPlugin.store.delete(sessionKey);
        return interaction.editReply(
          "Ein Problem beim Verarbeiten deiner Quizsession ist aufgetreten. Ich habe das Problem soeben behoben ??????. Bitte versuche es direkt erneut!",
        );
      }
    }

    interaction.editReply("Ich habe dir eine Privatnachricht geschickt, schau bitte in deine Privatnachrichten ????.");

    const voucherCode = QuizPlugin.voucherData.shift();

    if (!voucherCode) return interaction.editReply(bot.i18n.__({ phrase: messages.COMMAND_INTERNAL_ERROR, locale }));

    const questions = QuizPlugin.quizData.questions.sort(() => Math.random() - Math.random()).slice(0, numberOfQuestions);

    const filter = (reaction: MessageReaction, user: User) =>
      (reaction.emoji.name === "????" || reaction.emoji.name === "????" || reaction.emoji.name === "????") && user.id === interaction.user.id;

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
        Wie viel Geek steckt in dir? Zeig es uns und beantworte folgende Fragen rund um Filme, Serien, B??cher, Rollen-/Brettspiele und weitere absolut relevante Themen des Geek Daseins.

        Wenn du drei Fragen innerhalb von ${prettyMs(
          expiresInterval,
        )} richtig beantwortest, erh??ltst du sofort einen 20% Rabattcode f??r den [Pegasus Spiele Onlineshop](https://pegasusshop.de) - einl??sbar bis 31. M??rz auf alle sofort lieferbaren, nicht preisgebundenen Artikel. Gleichzeitig ist es uns eine Herzensangelegenheit diejenigen zu unterst??tzen, die vor dem Krieg in der Ukraine fl??chten m??ssen. Daher spenden wir 20% des so erzielten Umsatzes an das Aktionsb??ndnis Katastrophenhilfe zugunsten der Ukraine-Nothilfe.
        
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
      user: {
        id: interaction.user.id,
        tag: interaction.user.tag,
      },
    });

    for (const [index, question] of questions.entries()) {
      const quizEmbed = new MessageEmbed()
        .setColor(colors.blurple)
        .addField(`Frage ${index + 1} von ${numberOfQuestions}`, question.question)
        .addField("???? - " + question.answers[0], "-----")
        .addField("???? - " + question.answers[1], "-----")
        .addField("???? - " + question.answers[2], "-----")
        .setTimestamp();

      if (!isProduction()) quizEmbed.addField("Richtige Antwort", ["????", "????", "????"][question.correctIndex]);

      const runningQuizPlugin = await interaction.user.send({ embeds: [quizEmbed] });
      runningQuizPlugin.react("????");
      runningQuizPlugin.react("????");
      runningQuizPlugin.react("????");

      runningQuizPlugin.awaitReactions({ filter, max: 1, time: expiresInterval }).then(async (collected) => {
        if (collected.size === 0) return;

        const array = ["????", "????", "????"];
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
              Herzlichen Gl??ckwunsch, du hast alle drei Fragen richtig beantwortet!

              Dein Gutscheincode lautet ***${voucherCode.code}***. Du kannst ihn ab sofort und bis sp??testens 31.3.2022 unter https://pegasusshop.de einl??sen und erh??ltst dann sofort 20% Rabatt auf deine Bestellung sofort lieferbarer, nicht preisgebundener Artikel. 
                          
              Falls du regelm????ige Updates zu Aktionen wie dieser, aber auch zu Events und Angeboten erhalten m??chtest, dann abonniere jetzt unseren Newsletter auf https://pegasus.de/newsletter. Schau au??erdem auf https://conspiracy-con.de vorbei und entdecke die anderen CONspiracy-Aktionen!
                          
              Dein Pegabot :robot:     `),
            );
            QuizPlugin.store.set(sessionKey, {
              running: false,
              won: true,
              voucher: voucherCode,
              user: {
                id: interaction.user.id,
                tag: interaction.user.tag,
              },
            });
            QuizPlugin.store.set(`used-voucher-${voucherCode.code}`, {
              used: true,
              session: sessionKey,
            });
          } else {
            interaction.user.send(
              stripIndents(
                `
                Vielen Dank f??rs Mitmachen! :clap:
              
                Leider waren jedoch eine oder mehrere deiner Antworten nicht korrekt. Versuche es noch einmal :wink:
                
                Du m??chtest regelm????ig die neuesten Updates zu unseren Events, Aktionen und Angeboten erhalten? Dann abonniere unseren Newsletter unter https://pegasus.de/newsletter
                
                Dein Pegabot :robot:
                `,
              ),
            );
            QuizPlugin.store.set(sessionKey, {
              running: false,
              won: false,
              user: {
                id: interaction.user.id,
                tag: interaction.user.tag,
              },
            });

            // session was not won by the user so we need to push the voucher back to the voucher pool
            QuizPlugin.voucherData?.push(voucherCode);
          }
        }
      });
    }
  },
});
