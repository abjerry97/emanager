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
const qpayWalletSessionTokenSchemaObject = {
  status: defaultString, //0:deleted,1:active
  jwt: defaultString,
  walletId: defaultString,
  ownerId: defaultString,
  token: defaultString,
  tokenExpires: defaultString,
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

const QpayWalletSessionTokenSchema = new mongoose.Schema(
  qpayWalletSessionTokenSchemaObject
);

QpayWalletSessionTokenSchema.statics.getSchemaObject = () =>
  qpayWalletSessionTokenSchemaObject;
const QpayWalletSessionToken = mongoose.model(
  "QpayWalletSessionToken",
  QpayWalletSessionTokenSchema
);

module.exports = QpayWalletSessionToken;
