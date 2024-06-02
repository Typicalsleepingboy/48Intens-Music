const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'nowplaying',
    description: 'See what song is currently playing!',
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

        const track = queue.currentTrack;
        const methods = ['disabled', 'track', 'queue'];
        const timestamp = track.duration;
        const trackDuration = timestamp.progress == 'Infinity' ? 'infinity (live)' : track.duration;
        const progress = queue.node.createProgressBar();

        let EmojiState = client.config.app.enableEmojis;

        const emojis = client.config?.emojis;

        emojis ? EmojiState = EmojiState : EmojiState = false;

        const embed = new EmbedBuilder()
            .setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setThumbnail(track.thumbnail)
            .setDescription(await Translate(`Volume <**${queue.node.volume}**%> <\n> <Duration **${trackDuration}**> <\n> Progress <${progress}> <\n >Loop mode <**${methods[queue.repeatMode]}**> <\n>Requested by <${track.requestedBy}>`))
            .setFooter({ text: 'By 48Intens Official and Full automated 🤖', iconURL: 'https://cdn.discordapp.com/attachments/1189322953331048558/1246132122775978004/Comp_1_0-00-00-00.png?ex=665d40ba&is=665bef3a&hm=81795a405ac933a4f714baf60f4c2ada33d576a9c7f428b708baaf3b62eb11d5&' })
            .setColor('#1f1949')
            .setTimestamp();
        
        const saveButton = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.savetrack : ('Save this track'))
            .setCustomId('savetrack')
            .setStyle('Danger');

        const volumeup = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeUp : ('Volume Up'))
            .setCustomId('volumeup')
            .setStyle('Primary');

        const volumedown = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeDown : ('Volume Down'))
            .setCustomId('volumedown')
            .setStyle('Primary');

        const loop = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.loop : ('Loop'))
            .setCustomId('loop')
            .setStyle('Danger');

        const resumepause = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.ResumePause : ('Resume <&> Pause'))
            .setCustomId('resume&pause')
            .setStyle('Success');

        const row = new ActionRowBuilder().addComponents(volumedown, resumepause, volumeup, loop, saveButton);
        inter.editReply({ embeds: [embed], components: [row] });
    }
}
