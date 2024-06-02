const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'queue',
    description:('Get the songs in the queue'),
    voiceChannel: true,

    async execute({ client, inter }) {
        const queue = useQueue(inter.guild);

        if (!queue) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
        if (!queue.tracks.toArray()[0]) return inter.editReply({ content: await Translate(`No music in the queue after the current one <${inter.member}>... try again ? <❌>`) });

        const methods = ['', '🔁', '🔂'];
        const songs = queue.tracks.size;
        const nextSongs = songs > 5 ? await Translate(`And <**${songs - 5}**> other song(s)...`) : await Translate(`In the playlist <**${songs}**> song(s)...`);
        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by : ${track.requestedBy ? track.requestedBy.displayName : "unknown"})`);
        const embed = new EmbedBuilder()
            .setColor('#1f1949')
            .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true }))
            .setAuthor({ name: await Translate(`Server queue - <${inter.guild.name}> <${methods[queue.repeatMode]}>`), iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setDescription(await Translate(`Current <${queue.currentTrack.title}> <\n\n> <${tracks.slice(0, 5).join('\n')}> <\n\n> <${nextSongs}>`))
            .setTimestamp()
            .setFooter({ text: 'By 48Intens Official and Full automated 🤖', iconURL: 'https://cdn.discordapp.com/attachments/1189322953331048558/1246132122775978004/Comp_1_0-00-00-00.png?ex=665d40ba&is=665bef3a&hm=81795a405ac933a4f714baf60f4c2ada33d576a9c7f428b708baaf3b62eb11d5&' });

        inter.editReply({ embeds: [embed] });
    }
}