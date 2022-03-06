const mongoose = require('mongoose');

const EventSettingsSchema = new mongoose.Schema({
    guild_id : String,
    event_channel_id : String
});

module.exports = mongoose.model("EventSettings", EventSettingsSchema);