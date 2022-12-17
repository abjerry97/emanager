const QpayService = require("../../helpers/QpayService");
const {
  isValidMongoObject,
  isValidPhonenumber,
  isValidPassword,
  isValidArrayOfMongoObject,
} = require("../../helpers/validators"); 
const { CreateQpayCustomerObject } = require("../../utils/WalletTools/WalletTools");

class QpayWallet {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.apiClient = new QpayService("", "", "");
  }

  async __createWallet(payload) {
    const createdOn = new Date();
  
    const walletService = await new QpayService(
      ` https://app.scanpay.ng/api/v2/register`,
      await CreateQpayCustomerObject(payload),
      ""
    ).apiPostRequest();
    if (walletService.status != 200) {
      return { success: false, message: "Internal Server Error" };
    } else {
      return walletService;
    }
  }
  async __walletLogin(payload) {
    const createdOn = new Date();
 
    const walletService = await new QpayService(
      `https://app.scanpay.ng/api/v1/login`,
      payload,
      ""
    ).apiPostRequest(); 
    if (walletService.status != 200) {
      return { success: false, message: "Internal Server Error" };
    } else {
      return walletService;
    }
  }

  // async __checkWalletBalance() {
  //   const createdOn = new Date();
  //   if (!isValidMongoObject(this.res.user)) {
  //     return this.res.json({
  //       success: false,
  //       message: "Sorry!!...You are not Authorized",
  //     });
  //   }

  //   const userWallet = await UserWallet.findOne({
  //     status: 1,
  //     ownerId: this.res.user._id,
  //   });

  //   if (!isValidMongoObject(userWallet)) {
  //     return this.res.json({
  //       success: false,
  //       message:
  //         "Sorry!!...You don't have an active wallet account. contact your admin care",
  //     });
  //   }

  //   const userWalletSessionToken = await UserWalletSessionToken.findOne({
  //     status: 1,
  //     ownerId: this.res.user._id,
  //   });

  //   if (!isValidMongoObject(userWalletSessionToken)) {
  //     return this.res.json({
  //       success: false,
  //       message:
  //         "Sorry!!...You don't have an active wallet session Try loging in again",
  //     });
  //   }
  //   const walletService = await new QpayService(
  //     `https://app.scanpay.ng/api/v2/user/wallet-balance`,
  //     "",
  //     {
  //       Authorization: "Bearer " + userWalletSessionToken.jwt,
  //       "Content-Type": "application/json",
  //     }
  //   ).apiGetRequest();

  //   if (walletService.status != 200) {
  //     try {
  //       const newUserWalletBalance = await new UserWalletBalance({
  //         status: 1, //0:deleted,1:active
  //         ownerId: this.res.user._id,
  //         message: walletService.response.data.message,
  //         serverStatus: walletService.response.data.status,
  //         serverStatusCode: walletService.response.status,
  //         createdOn,
  //       });

  //       await newUserWalletBalance.save();
  //     } catch (error) {
  //       console.log(error);
  //     }

  //     if (walletService.response && walletService.response.status === 401) {
  //       try {
  //         const updatablePush = {
  //           updates: {
  //             by: this.res.user._id, // admin ID of the admin who made this update
  //             action: 0, //0:delete,
  //             timing: createdOn,
  //           },
  //         };
  //         const updateAllUserWalletToken =
  //           await UserWalletSessionToken.updateMany(
  //             {
  //               status: 1,
  //               ownerId: this.res.user._id,
  //             },
  //             {
  //               $set: {
  //                 status: 0,
  //               },
  //               $push: updatablePush,
  //             }
  //           );
  //       } catch (error) {
  //         console.log(error);
  //       }
  //       return this.res.json({
  //         success: false,
  //         message: "Wallet Session Expired, Try loging in again",
  //       });
  //     }

  //     return this.res.json({
  //       success: false,
  //       message: "Internal Server Error",
  //     });
  //   } else {
  //     try {
  //       const newUserWalletBalance = await new UserWalletBalance({
  //         status: 1, //0:deleted,1:active
  //         ownerId: this.res.user._id,
  //         message: walletService.data.message,
  //         walletMessage: walletService.data.data.message,
  //         success: walletService.data.data.success,
  //         error: walletService.data.data.error,
  //         code: walletService.data.data.code,
  //         bankCode: walletService.data.data.bank_code,
  //         bankName: walletService.data.data.bank_name,
  //         accountName: walletService.data.data.account_name,
  //         accountNumber: walletService.data.data.account_number,
  //         balance: walletService.data.data.balance,
  //         reference: walletService.data.data.reference,
  //         walletId: walletService.data.data.wallet_id,
  //         walletToken: walletService.data.data.wallet_token,
  //         phone: walletService.data.data.phone,
  //         email: walletService.data.data.email,
  //         walletCreatedAt: walletService.data.data.created_at,
  //         serverStatus: walletService.data.status,
  //         serverStatusCode: walletService.status,
  //         fos: walletService.data.data.fos,
  //         createdOn,
  //       });

  //       await newUserWalletBalance.save();
  //     } catch (error) {
  //       console.log(error);
  //     }

  //     return this.res.json({
  //       success: true,
  //       message: "Balance gotten successfully",
  //       data: walletService.data || {},
  //     });
  //   }
  // }
 
}
module.exports = QpayWallet;
