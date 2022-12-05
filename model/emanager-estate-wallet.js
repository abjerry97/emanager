const mongoose = require("mongoose"); 
const Email = require("./email");
const EmanagerUserWalletBalance = require("./emanager-user-wallet-balance");
const EmanagerEstateWalletBalance = require("./emanager-user-wallet-balance");
const Name = require("./name");
const RegisteredEstate = require("./registered-estate");
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
const emanagerEstateWalletSchemaObject = {
  status: defaultString, //0:deleted,1:active
  estateId: defaultString,  
  estate: [{ _id: defaultString, ...RegisteredEstate.getSchemaObject() }], 
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



const EmanagerEstateWalletSchema = new mongoose.Schema(emanagerEstateWalletSchemaObject);

EmanagerEstateWalletSchema.statics.getSchemaObject = () => emanagerEstateWalletSchemaObject;
const EmanagerEstateWallet = mongoose.model("EmanagerEstateWallet", EmanagerEstateWalletSchema);

module.exports = EmanagerEstateWallet;
