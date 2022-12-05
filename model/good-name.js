const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const goodNameSchemaObject = {
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
const GoodNameSchema = new mongoose.Schema(goodNameSchemaObject);

GoodNameSchema.statics.getSchemaObject = () => goodNameSchemaObject;
const GoodName = mongoose.model("GoodName", GoodNameSchema);

module.exports = GoodName;
