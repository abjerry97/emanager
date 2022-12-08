const {
  isValidFullName,
  isValidPhonenumber,
  isValidMongoObject,
  isValidMongoObjectId,
  isValidArrayOfMongoObject,
  isEmail,
  stringIsEqual,
} = require("../../helpers/validators");
const Email = require("../../model/email");
const EmailVerify = require("../../model/email-verify");
const User = require("../../model/user");

const { generateToken, generateCode, handlePass } = require("../../utils");

class VerifyAccounts {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async __verifyEmail() {
    const createdOn = new Date();
    const { token } = this.req.params;

    const foundemailverify = await EmailVerify.findOne({
      token,
    });

    if (!isValidMongoObject(foundemailverify)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Link not found",
      });
    }
    if (!stringIsEqual(foundemailverify.status,1)) {
      this.res.statusCode = 404;
      return this.res.json({
        success: false,
        message: "Link not active",
      });
    }

    if (foundemailverify.expiresOn < createdOn) {
      this.res.statusCode = 410;
      return this.res.json({
        success: false,
        message: "Link already expired",
      });
    }
    // if (!foundemailverify.isVerified) {
    //   this.res.statusCode = 410;
    //   return this.res.json({
    //     success: false,
    //     message: "Link not availiable",
    //   });
    // }

    try {
      const updateUnverifiedEmail = await Email.updateOne(
        {
          status: 1,
          _id: foundemailverify.ownerId,
        },
        {
          $set: { isVerified: true },
        }
      );
    } catch (error) {
      console.log(error);
    }

    const allUserEmail = await Email.find({
      status: 1,
      ownerId: foundemailverify.userId,
    });
    if (isValidArrayOfMongoObject(allUserEmail) && allUserEmail.length > 0) {
      try {
        const updateUnverifiedEmail = await User.updateOne(
          {
            status: 1,
            _id: foundemailverify.userId,
          },
          {
            $set: { emails: allUserEmail, isVerified: true },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }

    try {
      const updateUnverifiedEmail = await EmailVerify.updateOne(
        {
          status: 1,
          _id: foundemailverify._id,
        },
        {
          $set: { isVerified: true,status:0},
        }
      );
    } catch (error) {
      console.log(error);
    }
    return this.res.json({
      success: true,
      message: "Account Verified successfully ",
    });
  }
}
module.exports = VerifyAccounts;
