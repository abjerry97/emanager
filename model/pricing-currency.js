const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const pricingCurrencySchemaObject = {
  status: defaultString, //0:deleted,1:active
  value: defaultString, //currency position in the currencies.json config file
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString,//0:replace
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // admin ID of the admin who created this entry
  createdOn: defaultDate,
};
const PricingCurrencySchema = new mongoose.Schema(pricingCurrencySchemaObject);

PricingCurrencySchema.statics.getSchemaObject = () =>
  pricingCurrencySchemaObject;
const PricingCurrency = mongoose.model(
  "PricingCurrency",
  PricingCurrencySchema
);

module.exports = PricingCurrency;
