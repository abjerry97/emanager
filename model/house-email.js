const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const houseEmailSchemaObject = {
  status: defaultString, //0:deleted,1:is verified,2:not verified
  value: defaultString, 
  houseId: defaultString, 
  ownerType: defaultString, //house owner:0, 
  updates: [
    {
      by: defaultString, //user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
  createdOn: defaultDate,
};
const HouseEmailSchema = new mongoose.Schema(houseEmailSchemaObject);

HouseEmailSchema.statics.getSchemaObject = () => houseEmailSchemaObject;
const HouseEmail = mongoose.model("HouseEmail", HouseEmailSchema);

module.exports = HouseEmail;
