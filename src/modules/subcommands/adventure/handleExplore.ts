/* eslint-disable jsdoc/require-param */
import { explorations } from "../../../config/data/adventures";
import { monsters } from "../../../config/data/monsters";
import CharacterModel from "../../../database/models/CharacterModel";
import { CommandHandler } from "../../../interfaces/CommandHandler";
import { errorEmbedGenerator } from "../../../utils/errorEmbedGenerator";
import { rosaErrorHandler } from "../../../utils/rosaErrorHandler";
import { handleBattle } from "../../battle/handleBattle";
import { giveDungeon } from "../../results/giveDungeon";
import { giveItem } from "../../results/giveItem";
import { showCooldown } from "../../results/showCooldown";

/**
 * Handles the logic of visiting an exploration area.
 */
export const handleExplore: CommandHandler = async (Rosa, interaction) => {
  try {
    const user = interaction.user.id;
    const character = await CharacterModel.findOne({ discordId: user });

    if (!character) {
      await interaction.editReply({
        content: "You have not created a character yet!",
      });
      return;
    }

    const destination = interaction.options.getString("area", true);

    if (
      !character.adventure.areas.find(
        (el) => el.toLowerCase() === destination.toLowerCase()
      )
    ) {
      await interaction.editReply({
        content: "You have not found this area yet!",
      });
      return;
    }

    const location = explorations.find(
      (exploration) =>
        exploration.name.toLowerCase() === destination.toLowerCase()
    );

    if (!location) {
      await interaction.editReply({
        content: `You tried to explore ${destination} but that location isn't in the database. Please contact the developer.`,
      });
      return;
    }

    if (Date.now() - character.adventure.cooldown <= 0) {
      await interaction.editReply({
        embeds: [showCooldown(character.adventure.cooldown - Date.now())],
      });
      return;
    }

    character.adventure.cooldown = Date.now() + 3600000;

    const result = Math.ceil(Math.random() * 100);

    if (result <= 60) {
      const monsterIndex = Math.floor(
        Math.random() * location.results.monsters.length
      );
      const monsterName = location.results.monsters[monsterIndex];
      const monster = monsters.find((el) => el.name === monsterName);

      if (!monster) {
        await interaction.editReply({
          content: `You encountered a ${monsterName} but there was no data available. Please contact the developer.`,
        });
        return;
      }
      await handleBattle(Rosa, interaction, character, monster);
    }
    if (result > 60 && result <= 70) {
      await giveItem(Rosa, interaction, character, location);
    }
    if (result > 70 && result <= 80) {
      await giveDungeon(Rosa, interaction, character, location);
    }
    if (result > 80) {
      await character.save();
      await interaction.editReply({
        content: `You spend some time wandering the ${location.name}, but find nothing of importance. You return to town feeling unsatisfied.`,
      });
    }
  } catch (error) {
    const errorId = await rosaErrorHandler(
      Rosa,
      "explore command",
      error,
      interaction.guild?.id
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Rosa, "explore", errorId)],
    });
  }
};
