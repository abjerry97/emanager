const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const BillAmountSchemaObject = {
  status: defaultString, //0:inactive,1:active
  currency: defaultString, //0:Naira,1:USD
  value: defaultString,
  billId: defaultString,
  type:defaultString,//0:Estate Levy,1:Water Bill,2:waste Bill,1:Project Fee
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
  createdOn: defaultDate,
};
const BillAmountSchema = new mongoose.Schema(
  BillAmountSchemaObject
);

BillAmountSchema.statics.getSchemaObject = () =>
  BillAmountSchemaObject;
const BillAmount = mongoose.model(
  "BillAmount",
  BillAmountSchema
);

module.exports = BillAmount;
