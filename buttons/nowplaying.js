const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ client, inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing... try again ? <❌>`) });

    const track = queue.currentTrack;
    const methods = ['disabled', 'track', 'queue'];
    const timestamp = track.duration;
    const trackDuration = timestamp.progress == 'Infinity' ? 'infinity (live)' : track.duration;
    const progress = queue.node.createProgressBar();

    const embed = new EmbedBuilder()
        .setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
        .setThumbnail(track.thumbnail)
        .setDescription(await Translate(`Volume <**${queue.node.volume}**%\n> <Duration **${trackDuration}**\n> <Progress ${progress}\n> <Loop mode **${methods[queue.repeatMode]}**\n> <Requested by ${track.requestedBy}>`))
        .setFooter({ text: 'By 48Intens Official and Full automated 🤖', iconURL: 'https://cdn.discordapp.com/attachments/1189322953331048558/1246132122775978004/Comp_1_0-00-00-00.png?ex=665d40ba&is=665bef3a&hm=81795a405ac933a4f714baf60f4c2ada33d576a9c7f428b708baaf3b62eb11d5&' })
        .setColor('#1f1949')
        .setTimestamp();

    inter.editReply({ embeds: [embed] });
}
