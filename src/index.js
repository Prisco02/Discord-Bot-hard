const fs = require('node:fs'); //lettura file node.js
const { Client, Collection, Intents } = require('discord.js'); //api discord
const mongoose = require('mongoose');
require('dotenv').config(); //integra le variabili globali

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//si connette al Database
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Successfully connected to the database!'))
.catch(err => console.log(err));


//array con tutti gli eventi
const eventFiles = fs.readdirSync('src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//array con tutti i singoli comandi
client.commands = new Collection(); //crea collezione comandi
const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) //cicla tra tutti i file
{
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

//esecuzione comandi
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName); //assume nome comando

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


//Il bot esegue il login con il token
client.login(process.env.TOKEN); 