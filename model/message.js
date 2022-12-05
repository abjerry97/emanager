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
const messageSchemaObject = {
  status: defaultString, //0:deleted,1:active
  subject: { _id: defaultString, ...MessageSubject.getSchemaObject() },
  value: { _id: defaultString, ...MessageBody.getSchemaObject() },
  contextId: defaultString,
  createdOn: defaultDate,
  expiredOn: defaultDate,
  updates: [
    {
      by: defaultString, // user ID of the user who made this update
      action: defaultString,
      timing: defaultDate,
    },
  ],
  createdBy: defaultString, // user ID of the user who created this entry
};
const MessageSchema = new mongoose.Schema(messageSchemaObject);

MessageSchema.statics.getSchemaObject = () => messageSchemaObject;
const Message = mongoose.model("MessageSchema", MessageSchema);

module.exports = Message;
