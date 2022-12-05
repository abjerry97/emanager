const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const houseOwnerNameSchemaObject = {
  status: defaultString, //0:deleted,1:is verified,2:not verified
  value: defaultString,
  houseId: defaultString,
  ownerType: defaultString, //house owner:0, house agent 1
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
const HouseOwnerNameSchema = new mongoose.Schema(houseOwnerNameSchemaObject);

HouseOwnerNameSchema.statics.getSchemaObject = () => houseOwnerNameSchemaObject;
const HouseOwnerName = mongoose.model("HouseOwnerName", HouseOwnerNameSchema);

module.exports = HouseOwnerName;
