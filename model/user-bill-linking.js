const mongoose = require("mongoose");
const BillPayment = require("./bill-payment");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const userBillLinkingSchemaObject = {
  status: defaultString, //0:deleted,1:active
  billId: defaultString,
  ownerId: defaultString,
  estateId: defaultString,
  payment: { _id: defaultString, ...BillPayment.getSchemaObject() },
  amount: defaultString,
  outstanding: defaultString, 
  month: defaultString,
  year: defaultString,
  type:defaultString,//0:Estate Levy,1:Water Bill,2:waste Bill,1:Project Fee
  createdOn: defaultDate,
  dueOn: defaultDate,
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
};
const UserBillLinkingSchema = new mongoose.Schema(userBillLinkingSchemaObject);

UserBillLinkingSchema.statics.getSchemaObject = () =>
  userBillLinkingSchemaObject;
const UserBillLinking = mongoose.model(
  "UserBillLinkingSchema",
  UserBillLinkingSchema
);

module.exports = UserBillLinking;
