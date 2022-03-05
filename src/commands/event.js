const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('event')
		.setDescription('Crea Evento')
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('nome evento')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('tipo di evento')
                .setRequired(true)
                .addChoice('Guerra', 'guerra')
                .addChoice('Invasione', 'invasione'))
        .addChannelOption(option =>
            option.setName('canale')
                .setDescription('Scegli dove mettere evento')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('descrizione')
                .setDescription('breve descrizione')
                .setRequired(false)),

	async execute(interaction) {
        nome = interaction.options.getString('nome');
        tipo = interaction.options.getString('tipo');
        canale = interaction.options.getChannel('canale');
        descrizione = interaction.options.getString('descrizione');

        const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('Registrati')
					.setLabel('Registrati')
					.setStyle('PRIMARY')
                    .setEmoji('⚔️'),
                new MessageButton()
					.setCustomId('Esci')
					.setLabel('Esci')
					.setStyle('DANGER')
                    .setEmoji('🚷'),
			);
        const weapons = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('weapons')
                .setPlaceholder('Scegli 2 armi')
                .setMinValues(2)
                .setMaxValues(2)
                .addOptions([
                    {
                        label: 'Ascia Grande',
                        value: 'first_axe',
                    },
                    {
                        label: 'Accetta',
                        value: 'first_hatchet',
                    },
                    {
                        label: 'Martello',
                        value: 'first_hammer',
                    },
                    {
                        label: 'Spada e Scudo',
                        value: 'first_sword',
                    },
                    {
                        label: 'Lancia',
                        value: 'first_spear',
                    },
                    {
                        label: 'Stocco',
                        value: 'first_rapier',
                    },
                    {
                        label: 'Arco',
                        value: 'first_box',
                    },
                    {
                        label: 'Moschetto',
                        value: 'first_musket',
                    },
                    {
                        label: 'Bastone di Fuoco',
                        value: 'first_fire',
                    },
                    {
                        label: 'Guanto del Ghiaccio',
                        value: 'first_ice',
                    },
                    {
                        label: 'Bastone della Vita',
                        value: 'first_life',
                    },
                    {
                        label: 'Guanto del Vuoto',
                        value: 'first_void',
                    },
                ]),
            );
            
        await interaction.reply({content:`evento ${nome} di tipo ${tipo} è stato pubblicato nel canale ${canale}`, ephemeral: true});

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${nome}`);

        await canale.send({components: [buttons], embeds: [embed]});

        const collector = canale.createMessageComponentCollector({componentType: 'BUTTON'});
        collector.on('collect', async i => {
            if (i.customId === 'Registrati') {

                await i.reply({ content: 'Scegli le tue Armi!', ephemeral: true, components: [weapons]});
            }
        });
	}
};