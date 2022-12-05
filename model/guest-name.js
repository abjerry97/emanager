const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const guestNameSchemaObject = {
  status: defaultString, //0:inactive,1:active
  guestId: defaultString,
  type:defaultString,
  value: defaultString,
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
  createdOn: defaultDate,
};
const GuestNameSchema = new mongoose.Schema(guestNameSchemaObject);

GuestNameSchema.statics.getSchemaObject = () => guestNameSchemaObject;
const GuestName = mongoose.model("GuestName", GuestNameSchema);

module.exports = GuestName;
