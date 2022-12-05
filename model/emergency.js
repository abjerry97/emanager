const mongoose = require("mongoose");
const BillAmount = require("./bill-amount");
const BillDate = require("./bill-date");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const emergencySchemaObject = {
  status: defaultString, //0:inactive,1:active
  mode: defaultString,
  ownerType: defaultString, //user:0,admin:1
  ownerId: defaultString, //user:0,admin:1
  estateId: defaultString, //user:0,admin:1
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
const EmergencySchema = new mongoose.Schema(emergencySchemaObject);

EmergencySchema.statics.getSchemaObject = () => emergencySchemaObject;
const Emergency = mongoose.model("Emergency", EmergencySchema);

module.exports = Emergency;
