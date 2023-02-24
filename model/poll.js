const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const pollSchemaObject = {
  status: defaultString, //0:deleted,1:active
  value: defaultString,
  estateId: defaultString,
  type: defaultString, //0:exco, 1:others
  role:defaultString,
  createdOn: defaultDate, 
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
};
const PollSchema = new mongoose.Schema(pollSchemaObject);

PollSchema.statics.getSchemaObject = () => pollSchemaObject;
const Poll = mongoose.model("Poll", PollSchema);

module.exports = Poll;
