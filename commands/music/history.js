const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'history',
    description:('See the history of the queue'),
    voiceChannel: false,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);

        if (!queue || queue.history.tracks.toArray().length == 0) return inter.editReply({ content: await Translate(`No music has been played yet`) });

        const tracks = queue.history.tracks.toArray();

        let description = tracks
            .slice(0, 20)
            .map((track, index) => { return `**${index + 1}.** [${track.title}](${track.url}) by ${track.author}` })
            .join('\r\n\r\n');

        let historyEmbed = new EmbedBuilder()
            .setTitle(`History`)
            .setDescription(description)
            .setColor('#1f1949')
            .setTimestamp()
            .setFooter({ text: 'By 48Intens Official and Full automated 🤖', iconURL: 'https://cdn.discordapp.com/attachments/1189322953331048558/1246132122775978004/Comp_1_0-00-00-00.png?ex=665d40ba&is=665bef3a&hm=81795a405ac933a4f714baf60f4c2ada33d576a9c7f428b708baaf3b62eb11d5&' });

        inter.editReply({ embeds: [historyEmbed] });
    }
}