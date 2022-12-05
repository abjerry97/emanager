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
const suggestionSchemaObject = {
  status: defaultString, //0:deleted,1:active 
  contributorId: defaultString,//user Id of the contributor 
  contributorType: defaultString, //0:user,1: admin 
  type: defaultString, //0:house,1: estate 
  subjectId: defaultString, //0: house Id for type == 0,1: estate Id for type == 1,
  subjectName: defaultString,  
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
const SuggestionSchema = new mongoose.Schema(suggestionSchemaObject);

SuggestionSchema.statics.getSchemaObject = () => suggestionSchemaObject;
const Suggestion = mongoose.model("SuggestionSchema", SuggestionSchema);

module.exports = Suggestion;
