const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const guestEmailSchemaObject = {
  status: defaultString, //0:deleted,1:is verified,2:not verified  
  value: defaultString,
  type:defaultString,
  isPrimary: defaultString,
  guestId: defaultString,
  isVerified: defaultString,
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
const GuestEmailSchema = new mongoose.Schema(guestEmailSchemaObject);

GuestEmailSchema.statics.getSchemaObject = () => guestEmailSchemaObject;
const GuestEmail = mongoose.model("GuestEmail", GuestEmailSchema);

module.exports = GuestEmail;
