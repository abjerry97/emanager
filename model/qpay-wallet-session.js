const mongoose = require("mongoose"); 
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const defaultArray = {
  type: Array,
  default: [],
};
const qpayWalletSessionSchemaObject = {
  status: defaultString, //0:deleted,1:active
  bankCode: defaultString,
  walletUserId: defaultString,
  code: defaultString,
  walletId: defaultString,
  ownerId: defaultString, 
  email: defaultString,
  fullName: defaultString,
  isVerified: defaultString, //true//false
  reference: defaultString,
  referralCode: defaultString,
  error: defaultString,
  message: defaultString,
  address: defaultString,
  balance: defaultString,
  success: defaultString,
  cardDetails: defaultArray, 
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


const QpayWalletSessionSchema = new mongoose.Schema(
  qpayWalletSessionSchemaObject
);

QpayWalletSessionSchema.statics.getSchemaObject = () =>
  qpayWalletSessionSchemaObject;
const QpayWalletSession = mongoose.model(
  "QpayWalletSession",
  QpayWalletSessionSchema
);

module.exports = QpayWalletSession;
