const { ActivityType } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = async (client) => {
    console.log(await Translate(`Logged to the client <${client.user.username}>.`));
    console.log(await Translate("Let's play some music!"));

    const updateStatus = async () => {
        try {
            let customStatuses = [
                {
                    name: `🎧.Langit biru cinta searah`,
                    type: ActivityType.Listening,
                },
                {
                    name: `🎧.Hisatsu Teleport`,
                    type: ActivityType.Listening,
                },
                {
                    name: `🎧.Magic Hour`,
                    type: ActivityType.Listening,
                },
            ];

            let random = Math.floor(Math.random() * customStatuses.length);
            await client.user.setActivity(customStatuses[random]);
            await client.user.setStatus('idle');
        } catch (error) {
            console.error('Kesalahan untuk mengupdate status:', error);
        }
    };

    const logPing = () => {
        const ping = client.ws.ping;
        console.log(`Current ping: ${ping}ms`);
    };

    // Initial status update
    await updateStatus();
    setInterval(updateStatus, 5000);

    // Log ping every 30 seconds
    setInterval(logPing, 30000);
};
