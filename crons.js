const GatePass = require("./model/gate-pass");
const Guest = require("./model/guest");
const {
  isValidMongoObjectId,
  isValidArrayOfMongoObject,
} = require("./helpers/validators");
const EmailVerify = require("./model/email-verify"); 
const { sendEmailNovuNotification } = require("./utils/NovuNotifications/NovuNotification");
let shouldinvalidatePassRun = true
const invalidatePass = async () => {
    const currentDate = new Date();
  if(shouldinvalidatePassRun){
    shouldinvalidatePassRun= false
    try {
      const updatePass = await GatePass.find({
        status: 1,
        expiresOn: { $lte: currentDate },
      });
  
      if (isValidArrayOfMongoObject(updatePass)) {
        const pushUserPasses = await Promise.all(
          updatePass.map(async (foundPass, index) => {
            const contextId = foundPass.guestId;
  
            if (isValidMongoObjectId(contextId)) {
              try {
                const updateParticularPass = await GatePass.updateOne(
                  {
                    status: 1,
                    _id: foundPass._id,
                  },
                  {
                    $set: { status: "0" },
                  }
                );
  
                const updatePasses = await Guest.updateOne(
                  {
                    _id: contextId,
                  },
                  {
                    $set: { pass: foundPass },
                  }
                );
              } catch (error) {
                console.log(error);
              }
            }
          })
        );
      }
    } catch (err) {
      console.log(err);
    }}
    shouldinvalidatePassRun =true
  };
  let shouldverifyEmailRun = true;
  const verifyEmail = async () => {
    const currentDate = new Date(); 
if(shouldverifyEmailRun){
  shouldverifyEmailRun = false;
    try {
      const unverifiedEmails = await EmailVerify.find({
        status: 1,
        // isVerified: false,
        isMailSent: false,
      });
  
      if (isValidArrayOfMongoObject(unverifiedEmails)) {
        const updateUnverifiedEmails = await Promise.all(
          unverifiedEmails.map(async (unverifiedEmail, index) => {
            const ownerId = unverifiedEmail.userId;
            const emailId = unverifiedEmail.ownerId;
            const verifyemailId = unverifiedEmail._id;
  
            if (isValidMongoObjectId(emailId)) {
              if (unverifiedEmail.expiresOn < currentDate) {
                try {
                  const updateUnverifiedEmail = await EmailVerify.updateOne(
                    {
                      status: 1,
                      _id: verifyemailId,
                    },
                    {
                      $set: { status: "0" },
                    }
                  );
  
                  //   const updatePasses = await Guest.updateOne(
                  //     {
                  //       _id: contextId,
                  //     },
                  //     {
                  //       $set: { pass: foundPass },
                  //     }
                  //   );
                } catch (error) {
                  console.log(error);
                }
              } else if (!unverifiedEmail.isMailSent) {
                const result = await sendEmailNovuNotification(
                  unverifiedEmail.value,
                  `https://emanager.onrender.com/user/account/verify/${unverifiedEmail.token}`,
                  "verify-email"
                );
  
                if (!!result && !!result.status && result.status < 400)
                  try {
                    const updateUnverifiedEmail = await EmailVerify.updateOne(
                      {
                        status: 1,
                        _id: verifyemailId,
                      },
                      {
                        $set: { isMailSent: true },
                      }
                    );
                    //   const updatePasses = await Guest.updateOne(
                    //     {
                    //       _id: contextId,
                    //     },
                    //     {
                    //       $set: { pass: foundPass },
                    //     }
                    //   );
                  } catch (error) {
                    console.log(error);
                  }
              }
            }
          })
        );
      }
      // console.log(updatePass);
    } catch (err) {
      console.log(err);
    } 
    shouldverifyEmailRun = true;
 }
  };

  module.exports = {
    verifyEmail,
    invalidatePass, 
  };
  