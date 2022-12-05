const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
let passwordSchemaObject = {
  status: defaultString, //0:deleted,1:active,
  hashedForm: defaultString,
  ownerId: defaultString,
  isAdmin: defaultString,
  adminId: defaultString,
  ownerType: defaultString, //user:0,admin:1,2:guest,3:security
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
const PasswordSchema = new mongoose.Schema(passwordSchemaObject);

PasswordSchema.statics.getSchemaObject = () => passwordSchemaObject;
const Password = mongoose.model("Password", PasswordSchema);

module.exports = Password;
