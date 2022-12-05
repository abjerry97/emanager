const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const houseAddressNameSchemaObject = {
  status: defaultString, //0:inactive,1:active
  value: defaultString, 
  ownerType: defaultString,//user:0,admin:1,2:guest,3:security
  ownerId: defaultString,
  houseId: defaultString,
  houseOwnerType: defaultString,//tenant: 0 landlord:1
  apartmentType: defaultString,
  estateId: defaultString,
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // admin ID of the admin who created this entry
  createdOn: defaultDate,
};
const HouseAddressNameSchema = new mongoose.Schema(houseAddressNameSchemaObject);

HouseAddressNameSchema.statics.getSchemaObject = () => houseAddressNameSchemaObject;
const HouseAddressName = mongoose.model("HouseAddressName", HouseAddressNameSchema);

module.exports = HouseAddressName;
