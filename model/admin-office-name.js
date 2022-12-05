const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const adminOfficeNameSchemaObject = {
  status: defaultString, //0:deleted,1:active
  ownerId: defaultString,
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
const AdminOfficeNameSchema = new mongoose.Schema(adminOfficeNameSchemaObject);

AdminOfficeNameSchema.statics.getSchemaObject = () =>
  adminOfficeNameSchemaObject;
const AdminOfficeName = mongoose.model(
  "AdminOfficeName",
  AdminOfficeNameSchema
);

module.exports = AdminOfficeName;
