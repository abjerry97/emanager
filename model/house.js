const mongoose = require("mongoose"); 
const HouseAddressName = require("./house-address"); 
const HouseOwnerName = require("./house-owner-name");
const HousePhonenumber = require("./house-phonenumber");
const HouseDescription = require("./house-description");
const HouseEmail = require("./house-email");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const houseSchemaObject = {
  status: defaultString, //0:deleted,1:active
  estateId: defaultString,
  buildingType: defaultString,
  adType:defaultString,
  houseAddress: [{ _id: defaultString, ...HouseAddressName.getSchemaObject() }],
  description: [{ _id: defaultString, ...HouseDescription.getSchemaObject() }],
  ownerName: { _id: defaultString, ...HouseOwnerName.getSchemaObject() },
  ownerPhonenumber: {
    _id: defaultString,
    ...HousePhonenumber.getSchemaObject(),
  },
  ownerEmail: { _id: defaultString, ...HouseEmail.getSchemaObject() },
  agentName: { _id: defaultString, ...HouseOwnerName.getSchemaObject() },
  agentPhonenumber: {
    _id: defaultString,
    ...HousePhonenumber.getSchemaObject(),
  },
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
const HouseSchema = new mongoose.Schema(houseSchemaObject);

HouseSchema.statics.getSchemaObject = () => houseSchemaObject;
const House = mongoose.model("House", HouseSchema);

module.exports = House;
