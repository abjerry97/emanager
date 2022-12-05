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
const defaultNumber = {
  type: Number,
  default: 0,
};
const emanagerUserWalletBalanceSchemaObject = {
  status: defaultString, //0:deleted,1:active 
  userId: defaultString, 
  walletId: defaultString, 
  value: defaultNumber,      
  sessionToken: defaultString,
  referenceId: defaultString,
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, 
  createdOn: defaultDate,  
  updatedOn: defaultDate,  
};


const EmanagerUserWalletBalanceSchema = new mongoose.Schema(
  emanagerUserWalletBalanceSchemaObject
);

EmanagerUserWalletBalanceSchema.statics.getSchemaObject = () =>
  emanagerUserWalletBalanceSchemaObject;
const EmanagerUserWalletBalance = mongoose.model(
  "EmanagerUserWalletBalance",
  EmanagerUserWalletBalanceSchema
);

module.exports = EmanagerUserWalletBalance;
