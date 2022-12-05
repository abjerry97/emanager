const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const housePhonenumberSchemaObject = {
  status: defaultString, //0:deleted,1:is verified,2:not verified
  countryCode: defaultString, 
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
const HousePhonenumberSchema = new mongoose.Schema(housePhonenumberSchemaObject);

HousePhonenumberSchema.statics.getSchemaObject = () => housePhonenumberSchemaObject;
const HousePhonenumber = mongoose.model("HousePhonenumber", HousePhonenumberSchema);

module.exports = HousePhonenumber;
