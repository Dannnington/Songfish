const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");

module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Have Songfish join the voice channel that you are in."),
    run: async (client, interaction) => {
        await interaction.deferReply();
        let err;
        if (interaction.member.voice.channelId === null || interaction.member.voice.channelId === undefined) {
            return interaction.editReply("You must be in a voice channel in order to use this command.");
        };

        if (interaction.guild.me.voice.channelId !== null && interaction.guild.me.voice.channelId !== undefined) {
            return interaction.editReply("I am currently in a voice channel. Try again later.");
        };

        try { 
            await client.lavalink.createPlayer(interaction.guild.id)
                .connect(interaction.member.voice.channelId);

                await interaction.guild.me.voice.setDeaf(true);
        } catch (e) {
            err = true;
            return interaction.editReply(`An exception occurred whilst attempting to connect the bot. Try again later.`);
        };

        return interaction.editReply(`☑️ Connected to <#${interaction.member.voice.channel.id}>.`);
    }
};