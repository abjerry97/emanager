const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const guestPhoneNumberSchemaObject = {
  status: defaultString, //0:deleted,1:is verified,2:not verified
  countryCode: defaultString,
  value: defaultString,
  type:defaultString,
  guestId: defaultString,
  isPrimary: defaultString,
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
const GuestPhoneNumberSchema = new mongoose.Schema(guestPhoneNumberSchemaObject);

GuestPhoneNumberSchema.statics.getSchemaObject = () => guestPhoneNumberSchemaObject;
const GuestPhoneNumber = mongoose.model("GuestPhoneNumber", GuestPhoneNumberSchema);

module.exports = GuestPhoneNumber;
