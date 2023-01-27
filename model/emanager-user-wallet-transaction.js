const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultNumber = {
  type: Number,
  default: 0,
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
  default: false,
};
const emanagerUserWalletTransactionSchemaObject = {
  status: defaultString, //0:deleted,1:
  type: defaultString,// credit,debit 
  kind: defaultString,//0:wallet to wallet,1:wallet to external,2: external to emanager wallet  
  name: defaultString,
  destName: defaultString,
  isSuccesful:defaultBoolean,
  srcName: defaultString,
  isEstate: defaultString,
  estateId: defaultString,
  amount: defaultNumber, 
  walletId: defaultString,
  destId: defaultString,
  srcId: defaultString,
  userId: defaultString,
  adminId: defaultString,
  message: defaultString,
  statusCode: defaultString,
  serverStatusCode: defaultString,
  description: defaultString,
  account_number: defaultString,
  bank_code: defaultString,
  service_type: defaultString,
  datacode: defaultString,
  phone: defaultString,
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
