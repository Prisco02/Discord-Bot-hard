const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const eventSettings = require('../models/eventSettings');
const collector = require('../collectors/eventCollector');

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
                            value: 'axe',
                        },
                        {
                            label: 'Accetta',
                            value: 'hatchet',
                        },
                        {
                            label: 'Martello',
                            value: 'hammer',
                        },
                        {
                            label: 'Spada e Scudo',
                            value: 'sword',
                        },
                        {
                            label: 'Lancia',
                            value: 'spear',
                        },
                        {
                            label: 'Stocco',
                            value: 'rapier',
                        },
                        {
                            label: 'Arco',
                            value: 'box',
                        },
                        {
                            label: 'Moschetto',
                            value: 'musket',
                        },
                        {
                            label: 'Bastone di Fuoco',
                            value: 'fire',
                        },
                        {
                            label: 'Guanto del Ghiaccio',
                            value: 'ice',
                        },
                        {
                            label: 'Bastone della Vita',
                            value: 'life',
                        },
                        {
                            label: 'Guanto del Vuoto',
                            value: 'void',
                        },
                    ]),
                );
            
        await interaction.reply({content:`evento ${nome} di tipo ${tipo} è stato pubblicato nel canale ${canale}`, ephemeral: true});

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${nome}`);

        messaggio = await canale.send({components: [buttons], embeds: [embed]});


        //Salvo i dati sul Database
        const evento = new eventSettings({
            channel_id: `${canale.id}`,
            event_message_id: `${messaggio.id}`,
            creator_id: `${interaction.user.id}`,
            name: `${nome}`,
            type: `${tipo}`,
            description: `${descrizione}`
        });

        evento.save()
        .then(()=> console.log("Evento salvato sul Database"))
        .catch(err => console.log(err));

        const collector = canale.createMessageComponentCollector({});
        collector.on('collect', async i => {
            if (i.customId === 'Registrati') {

                await i.reply({ content: 'Scegli le tue Armi!', ephemeral: true, components: [weapons]});
            }
            if (i.customId === 'weapons') {
                selectedWeapons = (i.values + '').split(',');
                await i.reply({ content: `${i.user} hai scelto ${selectedWeapons[0]} ${selectedWeapons[1]}`, ephemeral: true});
            }
        });
	}
};