const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const nameSchemaObject = {
  status: defaultString, //0:inactive,1:active
  isAdmin: defaultString, //is not admin:0,admin:1
  ownerId: defaultString,
  adminId: defaultString,
  value: defaultString,
  ownerType: defaultString, //user:0,admin:1,2:guest,3:security
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
const NameSchema = new mongoose.Schema(nameSchemaObject);

NameSchema.statics.getSchemaObject = () => nameSchemaObject;
const Name = mongoose.model("Name", NameSchema);

module.exports = Name;
