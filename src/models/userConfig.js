const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userConfig = new Schema({
    user_id: String,
    primary_weapon: String,
    secondary_weapon: String,
    publisher_id
});

module.exports = mongoose.model('userConfig', userConfig);