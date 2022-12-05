const mongoose = require("mongoose");
const defaultString = {
  type: String,
  default: "",
};
const defaultDate = {
  type: Date,
  default: new Date(),
};
const votesSchemaObject = {
  status: defaultString, //0:deleted,1:active
  candidateName: defaultString,
  candidateId: defaultString,
  voterName: defaultString,
  voterId: defaultString,
  estateId: defaultString,
  type: defaultString, //0:exco, 1:others
  electionId: defaultString, //0:exco, 1:others
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
const VotesSchema = new mongoose.Schema(votesSchemaObject);

VotesSchema.statics.getSchemaObject = () => votesSchemaObject;
const Votes = mongoose.model("Votes", VotesSchema);

module.exports = Votes;
