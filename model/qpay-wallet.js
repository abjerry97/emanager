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
const qpayWalletSchemaObject = {
  status: defaultString, //0:deleted,1:active
  ownerId: defaultString, 
  walletId: defaultString, 
  email: defaultString,
  fullName: defaultString, 
  isVerified: defaultString, //true//false
  reference: defaultString,
  referralCode: defaultString,
  cardDetails: defaultArray,
  faciallyRecognized: defaultString,
  facialRecognitionPictures: defaultArray,
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



const QpayWalletSchema = new mongoose.Schema(qpayWalletSchemaObject);

QpayWalletSchema.statics.getSchemaObject = () => qpayWalletSchemaObject;
const QpayWallet = mongoose.model("QpayWallet", QpayWalletSchema);

module.exports = QpayWallet;
