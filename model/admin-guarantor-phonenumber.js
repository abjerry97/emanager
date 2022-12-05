const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const adminGuarantorsPhoneNumberSchemaObject = {
  status: defaultString, //0:deleted,1:active
  ownerId: defaultString,
  countryCode: defaultString, 
  value: defaultString, 
  estateId:defaultString,
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
const AdminGuarantorsPhoneNumberSchema = new mongoose.Schema(adminGuarantorsPhoneNumberSchemaObject);

AdminGuarantorsPhoneNumberSchema.statics.getSchemaObject = () =>
  adminGuarantorsPhoneNumberSchemaObject;
const AdminGuarantorsPhoneNumber = mongoose.model(
  "AdminGuarantorsPhoneNumber",
  AdminGuarantorsPhoneNumberSchema
);

module.exports = AdminGuarantorsPhoneNumber;
