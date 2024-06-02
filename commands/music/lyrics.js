const { EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'lyrics',
    description:('Get the lyrics for the current track'),
    voiceChannel: true,

    async execute({ inter }) {
        const player = useMainPlayer();
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

        const results = await player.lyrics
            .search({
                q: queue.currentTrack.title
            })
            .catch(async (e) => {
                console.log(e);
                return inter.editReply({ content: await Translate(`Error! Please contact Developers! | <❌>`) });
            });

        const lyrics = results?.[0];
        if (!lyrics?.plainLyrics) return inter.editReply({ content: await Translate(`No lyrics found for <${queue.currentTrack.title}>... try again ? <❌>`) });

        const trimmedLyrics = lyrics.plainLyrics.substring(0, 1997);

        const embed = new EmbedBuilder()
            .setTitle(await Translate(`Lyrics for <${queue.currentTrack.title}>`))
            .setAuthor({
                name: lyrics.artistName
            })
            .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
            .setFooter({ text: 'By 48Intens Official and Full automated 🤖', iconURL: 'https://cdn.discordapp.com/attachments/1189322953331048558/1246132122775978004/Comp_1_0-00-00-00.png?ex=665d40ba&is=665bef3a&hm=81795a405ac933a4f714baf60f4c2ada33d576a9c7f428b708baaf3b62eb11d5&' })
            .setTimestamp()
            .setColor('#1f1949');

        return inter.editReply({ embeds: [embed] });
    }
}

