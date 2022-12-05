const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const BillDateSchemaObject = {
  status: defaultString, //0:inactive,1:active
  value: defaultString,
  type:defaultString,//0:Estate Levy,1:Water Bill,2:waste Bill,1:Project Fee
  billId: defaultString,
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
const BillDateSchema = new mongoose.Schema(
  BillDateSchemaObject
);

BillDateSchema.statics.getSchemaObject = () =>
  BillDateSchemaObject;
const BillDate = mongoose.model(
  "BillDate",
  BillDateSchema
);

module.exports = BillDate;
