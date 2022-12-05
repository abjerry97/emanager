const mongoose = require("mongoose"); 
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const defaultBoolean = {
  type: Boolean,
  default: false,
};
const userFamilySchemaObject = {
  status: defaultString, //0:deleted,1:is verified,2:not verified
  ownerId: defaultString,
  houseAddressId: defaultString,
  isHouseOwner: defaultBoolean, //0:not house owner,1:house owner
  relationship: defaultString,
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
const UserFamilySchema = new mongoose.Schema(userFamilySchemaObject);

UserFamilySchema.statics.getSchemaObject = () => userFamilySchemaObject;
const UserFamily = mongoose.model("UserFamily", UserFamilySchema);

module.exports = UserFamily;
