const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'search',
    description: 'Search a song',
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description:('The song you want to search'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ client, inter }) {
        const player = useMainPlayer();
        const song = inter.options.getString('song');

        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        });

        if (!res?.tracks.length) return inter.editReply({ content: await Translate(`No results found <${inter.member}>... try again ? <❌>`) });

        const queue = player.nodes.create(inter.guild, {
            metadata: {
             channel: inter.channel
                    },
            spotifyBridge: client.config.opt.spotifyBridge,
            volume: client.config.opt.defaultvolume,
            leaveOnEnd: client.config.opt.leaveOnEnd,
            leaveOnEmpty: client.config.opt.leaveOnEmpty
        });
        const maxTracks = res.tracks.slice(0, 10);

        const embed = new EmbedBuilder()
            .setColor('#1f1949')
            .setAuthor({ name: await Translate(`Results for <${song}>`), iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setDescription(await Translate(`<${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\n> Select choice between <**1**> and <**${maxTracks.length}**> or <**cancel** ⬇️>`))
            .setTimestamp()
            .setFooter({ text: 'By 48Intens Official and Full automated 🤖', iconURL: 'https://cdn.discordapp.com/attachments/1189322953331048558/1246132122775978004/Comp_1_0-00-00-00.png?ex=665d40ba&is=665bef3a&hm=81795a405ac933a4f714baf60f4c2ada33d576a9c7f428b708baaf3b62eb11d5&' })

        inter.editReply({ embeds: [embed] });

        const collector = inter.channel.createMessageCollector({
            time: 15000,
            max: 1,
            errors: ['time'],
            filter: m => m.author.id === inter.member.id
        });

        collector.on('collect', async (query) => {
            collector.stop();
            if (query.content.toLowerCase() === 'cancel') {
                return inter.followUp({ content: await Translate(`Search cancelled <✅>`), ephemeral: false });
            }

            const value = parseInt(query);
            if (!value || value <= 0 || value > maxTracks.length) {
                return inter.followUp({ content: await Translate(`Invalid response, try a value between <**1**> and <**${maxTracks.length}**> or <**cancel**>... try again ? <❌>`), ephemeral: false });
            }

            try {
                if (!queue.connection) await queue.connect(inter.member.voice.channel);
            } catch {
                await player.deleteQueue(inter.guildId);
                return inter.followUp({ content: await Translate(`I can't join the voice channel <${inter.member}>... try again ? <❌>`), ephemeral: false });
            }

            await inter.followUp({content: await Translate(`Loading your search... <🎧>`), ephemeral: false });

            queue.addTrack(res.tracks[query.content - 1]);

            if (!queue.isPlaying()) await queue.node.play();
        });

        collector.on('end', async (msg, reason) => {
            if (reason === 'time') return inter.followUp({ content: await Translate(`Search timed out <${inter.member}>... try again ? <❌>`), ephemeral: false });
        });
    }
}
