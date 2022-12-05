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
const phoneNumberSchemaObject = {
  status: defaultString, //0:deleted,1:is verified,2:not verified
  countryCode: defaultString,
  value: defaultString,
  isPrimary: defaultString, //is not primary:0,is primary:1
  isAdmin: defaultString, //is not admin:0,admin:1
  isVerified: defaultBoolean,
  ownerId: defaultString,
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
const PhoneNumberSchema = new mongoose.Schema(phoneNumberSchemaObject);

PhoneNumberSchema.statics.getSchemaObject = () => phoneNumberSchemaObject;
const PhoneNumber = mongoose.model("PhoneNumber", PhoneNumberSchema);

module.exports = PhoneNumber;
