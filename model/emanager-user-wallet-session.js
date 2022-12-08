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
const emanagerUserWalletSessionSchemaObject = {
  status: defaultString, //0:deleted,1:active 
  userId: defaultString, 
  walletId: defaultString,      
  sessionToken: defaultString,
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString,
  createdOn: defaultDate, // admin ID of the admin who created this entry
};


const EmanagerUserWalletSessionSchema = new mongoose.Schema(
  emanagerUserWalletSessionSchemaObject
);

EmanagerUserWalletSessionSchema.statics.getSchemaObject = () =>
  emanagerUserWalletSessionSchemaObject;
const EmanagerUserWalletSession = mongoose.model(
  "EmanagerUserWalletSession",
  EmanagerUserWalletSessionSchema
);

module.exports = EmanagerUserWalletSession;
