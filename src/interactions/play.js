const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js-light");
const { Song } = require("@lavaclient/queue/dist/Song");



module.exports = {
    metadata: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play audio. Supports YouTube.")
        .addStringOption(o => o.setName("audio").setDescription("The playback URL or search term for the audio").setRequired(true)),
    run: async (client, interaction) => {
        await interaction.deferReply();
        if (interaction.options.getString("audio").toLowerCase().includes("squishmallow")) return interaction.editReply("no shut up with your squishmallow shit stfu");
        let err;
        if (interaction.member.voice.channelId === null || interaction.member.voice.channelId === undefined) {
            return interaction.editReply("You must be in a voice channel in order to use this command.");
        };

        if (interaction.clientUser.voice.channelId !== null && interaction.clientUser.voice.channelId !== undefined) {
            if (interaction.clientUser.voice.channelId !== interaction.member.voice.channelId) {
                return interaction.editReply("You must be in the same voice channel as the bot in order to play audio!");
            };
        };

        const results = await client.lavalink.rest.loadTracks(`ytsearch:${interaction.options.getString("audio")}`);
        if (results.tracks.length <= 0) return interaction.editReply("🚫 No results were found.");
        const track = results.tracks[0];
        try {
            const player = await client.lavalink.createPlayer(interaction.guild.id)

            if (!player.connected) player.connect(interaction.member.voice.channelId);

            await player.queue.add([ track ]);

            if (!player.playing) {
                await player.queue.start();
            };

            if (player.paused) {
                await player.resume();
            };
            
        } catch (e) {
            err = true;
            return interaction.editReply(`An exception occurred whilst attempting to play audio. Try again later.`);
        };

        if (err === true) return;
        return interaction.editReply(`🎵  Added song: \`${track.info.title}\``);
    }
};