//This model to make a database for the record and its correlate quickorder
const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  audio: {
    type: String,
  },
  quickOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuickOrder",
  },
  public_id: {
    type: String,
  },
});

const Record = new mongoose.model("Record", recordSchema);
module.exports = Record;
