const mongoose = require('mongoose');

var stopwordsSchema = new mongoose.Schema({

    stopwords: { type: Array, required: true }
});

module.exports = stopwordsSchema;