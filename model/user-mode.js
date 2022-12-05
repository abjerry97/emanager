const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const userModeSchemaObject = {
  status: defaultString, //0:deleted,1:active
  mode:  defaultString, //0:avaliable,1:travel
  userId: defaultString,
  estateId: defaultString,
  ownerType: defaultString, //user:0,admin:1,2:guest,3:security
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
const UserModeSchema = new mongoose.Schema(userModeSchemaObject);

UserModeSchema.statics.getSchemaObject = () => userModeSchemaObject;
const UserMode = mongoose.model("UserMode", UserModeSchema);

module.exports = UserMode;
