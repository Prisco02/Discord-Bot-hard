const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSettings = new Schema({
    channel_id: String,
    event_message_id: String,
    creator_id: String,
    name: String,
    type: String,
    description: String
});

module.exports = mongoose.model('eventSettings', eventSettings);