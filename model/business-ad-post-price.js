const mongoose = require("mongoose"); 
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const businessAdPostPriceSchemaObject = {
  status: defaultString, //0:inactive,1:active
  currency: defaultString, //0:Naira,1:USD
  value: defaultString, 
  type:defaultString,
  updates: [
    {
      by: defaultString, // admin ID of the user who made this update
      action: defaultString, 
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
  createdOn: defaultDate,
};
const BusinessAdPostPriceSchema = new mongoose.Schema(businessAdPostPriceSchemaObject);

BusinessAdPostPriceSchema.statics.getSchemaObject = () => businessAdPostPriceSchemaObject;
const BusinessAdPostPrice = mongoose.model("BusinessAdPostPrice", BusinessAdPostPriceSchema);

module.exports = BusinessAdPostPrice;
