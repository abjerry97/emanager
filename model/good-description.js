const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const goodDescriptionSchemaObject = {
  status: defaultString, //0:deleted,1:active
  goodId: defaultString,
  value: defaultString,
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
const GoodDescriptionSchema = new mongoose.Schema(goodDescriptionSchemaObject);

GoodDescriptionSchema.statics.getSchemaObject = () =>
  goodDescriptionSchemaObject;
const GoodDescription = mongoose.model(
  "GoodDescription",
  GoodDescriptionSchema
);

module.exports = GoodDescription;
