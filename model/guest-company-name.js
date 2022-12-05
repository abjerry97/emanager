const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};

const guestCompanyNameSchemaObject = {
  status: defaultString, //0:deleted,1:active
  value: defaultString,
  type:defaultString,
  guestId: defaultString,
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

const GuestCompanyNameSchema = new mongoose.Schema(guestCompanyNameSchemaObject);

GuestCompanyNameSchema.statics.getSchemaObject = () => guestCompanyNameSchemaObject;
const GuestCompanyName = mongoose.model("GuestCompanyName", GuestCompanyNameSchema);

module.exports = GuestCompanyName;
