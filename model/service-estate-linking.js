const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const serviceEstateLinkingSchemaObject = {
  status: defaultString, //0:deleted,1:active
  serviceId: defaultString,
  estateId: defaultString,
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
const ServiceEstateLinkingSchema = new mongoose.Schema(serviceEstateLinkingSchemaObject);

ServiceEstateLinkingSchema.statics.getSchemaObject = () =>
  serviceEstateLinkingSchemaObject;
const ServiceEstateLinking = mongoose.model(
  "ServiceEstateLinking",
  ServiceEstateLinkingSchema
);

module.exports = ServiceEstateLinking;
