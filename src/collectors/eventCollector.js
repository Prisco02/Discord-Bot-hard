const eventSettings = require('../models/eventSettings');

exports.collectEvents = function collectEvents() {
    eventi = eventSettings.aggregate([
        {
            $group: {
             _id: "$channel_id"
            }
        }
    ]);

    function iterateFunc(doc) {
        console.log(JSON.stringify(doc, null, 4));
     }
     
     function errorFunc(error) {
        console.log(error);
     }
     
     cursor.forEach(iterateFunc, errorFunc);

    return;
    
    for(const ev in eventi){
        const collector = ev.createMessageComponentCollector({});
        console.log("collector creato");
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
}