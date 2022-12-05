const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const businessDaysSchemaObject = {
  status: defaultString, //0:deleted,1:active
  day: defaultString,
  openAt: defaultString,
  closeAt: defaultString,
  businessId: defaultString,
  createdOn: defaultDate,
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // admin ID of the admin who created this entry
};
const BusinessDaysSchema = new mongoose.Schema(businessDaysSchemaObject);

BusinessDaysSchema.statics.getSchemaObject = () => businessDaysSchemaObject;
const BusinessDays = mongoose.model("BusinessDays", BusinessDaysSchema);

module.exports = BusinessDays;
