const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const BillPaymentHistorySchemaObject = {
  status: defaultString, //0:inactive,1:active
  isSuccesful: defaultString, //0:false,1:false
  amount: defaultString,
  billId: defaultString, 
  billPaymentId: defaultString ,   
  from: defaultString,
  to: defaultString,
  type:defaultString,//0:Estate Levy,1:Water Bill,2:waste Bill,1:Project Fee
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
  dueOn: defaultDate,
  createdOn: defaultDate,
};
const BillPaymentHistorySchema = new mongoose.Schema(
  BillPaymentHistorySchemaObject
);

BillPaymentHistorySchema.statics.getSchemaObject = () =>
  BillPaymentHistorySchemaObject;
const BillPaymentHistory = mongoose.model(
  "BillPaymentHistory",
  BillPaymentHistorySchema
);

module.exports = BillPaymentHistory;
