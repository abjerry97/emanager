const mongoose = require("mongoose"); 
const Email = require("./email");
const EmanagerUserWalletBalance = require("./emanager-user-wallet-balance");
const Name = require("./name");
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
const defaultBoolean = {
  type: Boolean,
  default: false,
}; 
const emanagerUserWalletSchemaObject = {
  status: defaultString, //0:deleted,1:active
  userId: defaultString,  
  emails: [{ _id: defaultString, ...Email.getSchemaObject() }],
  name: [{ _id: defaultString, ...Name.getSchemaObject() }], 
  reference: defaultString,
  token: defaultString,
  referralCode: defaultString,
  balance: { _id: defaultString, ...EmanagerUserWalletBalance.getSchemaObject() } , 
  isVerified: defaultBoolean, //true//false  
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



const EmanagerUserWalletSchema = new mongoose.Schema(emanagerUserWalletSchemaObject);

EmanagerUserWalletSchema.statics.getSchemaObject = () => emanagerUserWalletSchemaObject;
const EmanagerUserWallet = mongoose.model("EmanagerUserWallet", EmanagerUserWalletSchema);

module.exports = EmanagerUserWallet;
