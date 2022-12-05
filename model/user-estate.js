const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const userEstateSchemaObject = {
  status: defaultString, //0:deleted,1:is verified,2:not verified
  ownerId: defaultString,
  estateId: defaultString,
  ownerType: defaultString, //user:0,admin:1,2:guest,3:security
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
const UserEstateSchema = new mongoose.Schema(userEstateSchemaObject);

UserEstateSchema.statics.getSchemaObject = () => userEstateSchemaObject;
const UserEstate = mongoose.model("UserEstate", UserEstateSchema);

module.exports = UserEstate;
