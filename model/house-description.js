const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const houseDescriptionSchemaObject = {
  status: defaultString, //0:deleted,1:is verified,2:not verified 
  value: defaultString, 
  houseId: defaultString,  
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
const HouseDescriptionSchema = new mongoose.Schema(houseDescriptionSchemaObject);

HouseDescriptionSchema.statics.getSchemaObject = () => houseDescriptionSchemaObject;
const HouseDescription = mongoose.model("HouseDescription", HouseDescriptionSchema);

module.exports = HouseDescription;
