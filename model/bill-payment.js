const mongoose = require("mongoose");
const BillPaymentHistory = require("./bill-payment-history");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const defaultNumber = {
  type: Number,
  default: 0,
};
const BillPaymentSchemaObject = {
  status: defaultString, //0:inactive,1:active
  isSuccesful: defaultString, //0:false,1:false
  amount: defaultString,
  ownerId: defaultString,
  estateId: defaultString,
  billLinkingId: defaultString,
  billId: defaultString,
  ownerName: defaultString,
  ownerAddress: defaultString,
  history:  [{ _id: defaultString, ...BillPaymentHistory.getSchemaObject() }],
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
const BillPaymentSchema = new mongoose.Schema(
  BillPaymentSchemaObject
);

BillPaymentSchema.statics.getSchemaObject = () =>
  BillPaymentSchemaObject;
const BillPayment = mongoose.model(
  "BillPayment",
  BillPaymentSchema
);

module.exports = BillPayment;
