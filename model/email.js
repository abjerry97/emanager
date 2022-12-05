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
const emailSchemaObject = {
  status: defaultString, //0:deleted,1:is verified,2:not verified
  value: defaultString,
  isPrimary: defaultString, //is not primary:0,is primary:1
  isAdmin: defaultString, //is not admin:0,admin:1
  isVerified: defaultBoolean,
  ownerId: defaultString,
  adminId: defaultString,
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
const EmailSchema = new mongoose.Schema(emailSchemaObject);

EmailSchema.statics.getSchemaObject = () => emailSchemaObject;
const Email = mongoose.model("Email", EmailSchema);

module.exports = Email;
