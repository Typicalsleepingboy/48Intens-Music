const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'controller',
    description:("Send music controller to a channel"),
    voiceChannel: false,
    permissions: PermissionsBitField.Flags.ManageMessages,
    options: [
        {
            name: 'channel',
            description:('The text channel you want to send it to'),
            type: ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],

    async execute({ inter }) {
        const channel = inter.options.getChannel('channel');
        if (channel.type !== ChannelType.GuildText) return inter.editReply({ content: await Translate(`You need to send it to a text channel.. <❌>`) });

        const embed = new EmbedBuilder()
            .setTitle(await Translate('Control your music with the buttons below !'))
            .setImage(inter.guild.iconURL({ size: 4096, dynamic: true }))
            .setColor('#1f1949')
            .setFooter({ text: 'By 48Intens Official and Full automated 🤖', iconURL: 'https://cdn.discordapp.com/attachments/1189322953331048558/1246132122775978004/Comp_1_0-00-00-00.png?ex=665d40ba&is=665bef3a&hm=81795a405ac933a4f714baf60f4c2ada33d576a9c7f428b708baaf3b62eb11d5&' });

        inter.editReply({ content: await Translate(`Sending controller to <${channel}>... <✅>`) });

        let EmojiState = client.config.app.enableEmojis;

        const emojis = client.config.emojis;

        emojis ? EmojiState = EmojiState : EmojiState = false;

        const back = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.back : ('Back'))
            .setCustomId('back')
            .setStyle('Primary');

        const skip = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.skip : ('Skip'))
            .setCustomId('skip')
            .setStyle('Primary');

        const resumepause = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.ResumePause : ('Resume & Pause'))
            .setCustomId('resume&pause')
            .setStyle('Danger');

        const save = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.savetrack : ('Save'))
            .setCustomId('savetrack')
            .setStyle('Success');

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

        const np = new ButtonBuilder()
            .setLabel('Now Playing')
            .setCustomId('nowplaying')
            .setStyle('Secondary');

        const queuebutton = new ButtonBuilder()
            .setLabel('Queue')
            .setCustomId('queue')
            .setStyle('Secondary');

        const lyrics = new ButtonBuilder()
            .setLabel('lyrics')
            .setCustomId('Lyrics')
            .setStyle('Primary');

        const shuffle = new ButtonBuilder()
            .setLabel('Shuffle')
            .setCustomId('shuffle')
            .setStyle('Success');

        const stop = new ButtonBuilder()
            .setLabel('Stop')
            .setCustomId('stop')
            .setStyle('Danger');

        const row1 = new ActionRowBuilder().addComponents(back, resumepause, skip, stop, save);
        const row2 = new ActionRowBuilder().addComponents(volumedown, volumeup, loop);
        const row3 = new ActionRowBuilder().addComponents(lyrics, shuffle, queuebutton, np);

        channel.send({ embeds: [embed], components: [row1, row2, row3] });
    }
}