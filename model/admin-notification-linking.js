const mongoose = require("mongoose");
const MessageBody = require("./message-body"); 
const MessageSubject = require("./message-subject");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const defaultBoolean = {
  type: Boolean,
  default: false,
};
const adminNotificationLinkingSchemaObject = {
  status: defaultString, //0:deleted,1:active 
  contextId: defaultString,
  ownerId: defaultString,
  isRead: defaultBoolean,
  kind: defaultString, //0:notice,1: suggestion,2: forum
  createdOn: defaultDate,
  expiredOn: defaultDate,
  updates: [
    {
      by: defaultString, // admin ID of the admin who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // admin ID of the admin who created this entry
};
const AdminNotificationLinkingSchema = new mongoose.Schema(adminNotificationLinkingSchemaObject);

AdminNotificationLinkingSchema.statics.getSchemaObject = () => adminNotificationLinkingSchemaObject;
const AdminNotificationLinking = mongoose.model("AdminNotificationLinkingSchema", AdminNotificationLinkingSchema);

module.exports = AdminNotificationLinking;
