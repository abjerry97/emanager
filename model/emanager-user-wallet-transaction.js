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
const defaultBoolean = {
  type: Boolean,
  default: [],
};
const emanagerUserWalletTransactionSchemaObject = {
  status: defaultString, //0:deleted,1:
  type: defaultString,
  name: defaultString,
  ownerName: defaultString,
  isEstate: defaultString,
  estateId: defaultString,
  amount: defaultString,
  isDebit: defaultBoolean,
  walletId: defaultString,
  userId: defaultString,
  adminId: defaultString,
  message: defaultString,
  statusCode: defaultString,
  serverStatusCode: defaultString,
  serverStatus: defaultString,
  transactionStatus: defaultString,
  transactionReference: defaultString,
  reference: defaultString,
  transactionMessage: defaultString, //true//false
  baxiReference: defaultString,
  providerMessage: defaultString,
  tokenCode: defaultString,
  tokenAmount: defaultString,
  amountOfPower: defaultString,
  creditToken: defaultString,
  resetToken: defaultString,
  configureToken: defaultString,
  pins: defaultArray,
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

const UserWalletTransactionSchema = new mongoose.Schema(
  emanagerUserWalletTransactionSchemaObject
);

UserWalletTransactionSchema.statics.getSchemaObject = () =>
  emanagerUserWalletTransactionSchemaObject;
const UserWalletTransaction = mongoose.model(
  "UserWalletTransaction",
  UserWalletTransactionSchema
);

module.exports = UserWalletTransaction;
