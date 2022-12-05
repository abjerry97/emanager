const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const serviceImageSchemaObject = {
  status: defaultString, //0:deleted,1:active
  serviceId: defaultString,
  url: defaultString,
  default: defaultString,
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
const ServiceImageSchema = new mongoose.Schema(serviceImageSchemaObject);

ServiceImageSchema.statics.getSchemaObject = () =>
  serviceImageSchemaObject;
const ServiceImage = mongoose.model(
  "ServiceImage",
  ServiceImageSchema
);

module.exports = ServiceImage;
