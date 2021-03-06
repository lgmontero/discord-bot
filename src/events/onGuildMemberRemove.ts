import BeccaInt from "../interfaces/BeccaInt";
import {
  GuildMember,
  MessageEmbed,
  PartialGuildMember,
  TextChannel,
} from "discord.js";
import { sleep } from "../utils/extendsMessageToMessageInt";

async function onGuildMemberRemove(
  member: GuildMember | PartialGuildMember,
  Becca: BeccaInt
): Promise<void> {
  try {
    // Get the user and the current guild.
    const { user, guild, nickname, roles } = member;

    // Check if the new member is a valid user.
    if (!user) {
      return;
    }

    const serverSettings = await Becca.getSettings(guild.id, guild.name);

    // Get the goodbye channel from the database.
    const goodbyeChannel = guild.channels.cache.find(
      (chan) => chan.id === serverSettings.welcome_channel
    );

    // Check if the goodbye channel exists.
    if (!goodbyeChannel) {
      return;
    }

    const roleList = roles.cache.map((el) => el);

    (goodbyeChannel as TextChannel).startTyping();
    await sleep(3000);

    (goodbyeChannel as TextChannel).stopTyping();

    // Send an embed message to the goodbye channel.
    await (goodbyeChannel as TextChannel).send(
      new MessageEmbed()
        .setColor("#AB47E7")
        .setTitle("A user has left us!")
        .setDescription(
          `${nickname || user.username} has left us. You will be missed!`
        )
        .addField("The user had these roles:", roleList)
    );
  } catch (error) {
    if (Becca.debugHook) {
      Becca.debugHook.send(
        `${member.guild?.name} had an error with the automatic goodbye feature. Please check the logs.`
      );
    }
    console.log(
      `${member.guild?.name} had this error with the automatic goodbye feature:`
    );
    console.log(error);
  }
}

export default onGuildMemberRemove;
