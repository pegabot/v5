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
      console.log(QuizPlugin.voucherData, QuizPlugin.quizData);
      return interaction.editReply(bot.i18n.__({ phrase: messages.COMMAND_INTERNAL_ERROR, locale }));
    }

    const sessionKey = `${QuizPlugin.quizData.name}-${interaction.user.id}`;

    let existingSession = await QuizPlugin.store.get(sessionKey);
    if (existingSession) {
      // generateTranslation "plugin.quiz.command.quiz.noSessionForYou"
      return interaction.editReply(bot.i18n.__({ phrase: "plugin.quiz.command.quiz.noSessionForYou", locale }));
    }

    QuizPlugin.store.set(sessionKey, {
      running: true,
    });

    const voucherCode = QuizPlugin.voucherData.shift();
    const questions = QuizPlugin.quizData.questions.sort(() => Math.random() - Math.random()).slice(0, numberOfQuestions);

    const filter = (reaction: MessageReaction, user: User) =>
      (reaction.emoji.name === "🇦" || reaction.emoji.name === "🇧" || reaction.emoji.name === "🇨") && user.id === interaction.user.id;

    let winning = true;
    let counter = 0;

    // todo: change the texts

    interaction.user.send({
      embeds: [
        new MessageEmbed({
          footer: { text: `SessionId - ${sessionKey}` },
        })
          .setColor(colors.yellow)
          .setTitle(`CONspiracy VII - das QuizPlugin!`)
          .setDescription(
            stripIndents(`
        Wie viel Geek steckt in dir? Zeig es uns und beantworte folgende Fragen rund um Filme, Serien, Bücher, Rollen-/Brettspiele und weitere absolut relevante Themen des Geek Daseins. 
        
        Zur Beantwortung der Fragen hast du ${prettyMs(expiresInterval)} Zeit. 
        Beantworte uns folgende Fragen richtig und erhalte sofort einen Gutscheincode für das Shadowrun Grundregelwerk.
        
        Um die Fragen zu beantworten, klicke auf A, B oder C unterhalb der jeweiligen Frage.
        Viel Erfolg! :four_leaf_clover:
      `) as string,
          )
          .setTimestamp(),
      ],
    });

    for (const [index, question] of questions.entries()) {
      const quizEmbed = new MessageEmbed()
        .setColor(colors.blurple)
        .addField(`Frage ${index + 1} von ${numberOfQuestions}`, question.question)
        .addField("🇦 - " + question.answers[0], "-----")
        .addField("🇧 - " + question.answers[1], "-----")
        .addField("🇨 - " + question.answers[2], "-----")
        .setTimestamp();

      if (process.env.NODE_ENV !== "production") quizEmbed.addField("Richtige Antwort", ["🇦", "🇧", "🇨"][question.correctIndex]);

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
              Herzlichen Glückwunsch – du hast alle Fragen richtig beantwortet! :tada:
              
              ${voucherCode}

              Dein Gutscheincode wird gerade erstellt. Bitte warte einen Moment  - dein Gutscheincode wird dir hier in wenigen Sekunden angezeigt.\n\n
              `),
            );
            QuizPlugin.store.set(sessionKey, {
              running: false,
              won: true,
              voucher: voucherCode,
            });
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
          }
        }
      });
    }
  },
});
