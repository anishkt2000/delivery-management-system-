const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  cardId: String,
  userMobile: String,
  Delivered: {type:Number, default :0},
  timestamp: Date,
  attempt: { type: Number, default: 0 }, // Set default value for attempt field
  comment: String,
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;


