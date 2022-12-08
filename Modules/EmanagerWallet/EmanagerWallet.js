const QpayService = require("../../helpers/QpayService");
const {
  isValidMongoObject,
  isValidPhonenumber,
  isValidPassword,
  isValidArrayOfMongoObject,
  stringIsEqual,
  isValidMongoObjectId,
} = require("../../helpers/validators");
const crypto = require("crypto"); 
const EmanagerUserWallet = require("../../model/emanager-user-wallet");
const EmanagerUserWalletSession = require("../../model/emanager-user-wallet-session");
const EmanagerUserWalletBalance = require("../../model/emanager-user-wallet-balance");
const { QpayWalletHeader } = require("../../helpers/tools");
const QpayWalletSession = require("../../model/qpay-wallet-session");
const QpayWalletSessionToken = require("../../model/qpay-wallet-session-token");
const QpayWallet = require("../QpayWallet/QpayWallet");
const EmanagerEstateWallet = require("../../model/emanager-estate-wallet");
const UserWalletTransaction = require("../../model/emanager-user-wallet-transaction");
const { generateWalletToken } = require("../../utils/tokenGenerator");

class EmanagerWallet {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.apiClient = new QpayService("", "", "");
    this.qpayWallet = new QpayWallet(this.req, this.res);
  }

  async __createWallet(user) {
    const createdOn = new Date();
    user = this.res.user || user;
    if (!isValidMongoObject(user)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Unable to create Wallet, Please try again",
      });
    }
    const newlyCreatedWalletBalance = await new EmanagerUserWalletBalance({
      status: 1,
      ownerId: user._id,
      createdOn,
    });
    if (!isValidMongoObject(newlyCreatedWalletBalance)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating wallet balance",
      });
    }
    const newlyCreatedUserWallet = await new EmanagerUserWallet({
      status: 1,
      userId: user._id,
      emails: user.emails,
      name: user.name,
      createdOn,
      token: crypto.randomBytes(16).toString("hex"),
    });

    if (!isValidMongoObject(newlyCreatedUserWallet)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating wallet",
      });
    }
    newlyCreatedWalletBalance.walletId = newlyCreatedUserWallet._id;
    newlyCreatedUserWallet.balance = newlyCreatedWalletBalance;
    await newlyCreatedWalletBalance.save();
    await newlyCreatedUserWallet.save();
    return newlyCreatedUserWallet;
  }
  async __createEstateWallet(estate, admin) {
    const createdOn = new Date();
    if (!isValidMongoObject(estate) || !isValidMongoObject(admin)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Unable to create Wallet, Please try again",
      });
    }
    const newlyCreatedWalletBalance = await new EmanagerUserWalletBalance({
      status: 1,
      ownerId: estate._id,
      createdBy: admin._id,
      createdOn,
    });
    if (!isValidMongoObject(newlyCreatedWalletBalance)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating wallet balance",
      });
    }
    const newlyCreatedEstateWallet = await new EmanagerEstateWallet({
      status: 1,
      estateId: estate._id,
      estate: estate,
      createdOn,
      createdBy: admin._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    if (!isValidMongoObject(newlyCreatedEstateWallet)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error while creating estate wallet",
      });
    }
    newlyCreatedWalletBalance.walletId = newlyCreatedEstateWallet._id;
    newlyCreatedEstateWallet.balance = newlyCreatedWalletBalance;
    await newlyCreatedWalletBalance.save();
    await newlyCreatedEstateWallet.save();
    return newlyCreatedEstateWallet;
  }

  async __walletLogin(user) {
    const createdOn = new Date();
    user = this.res.user || user;
    if (!isValidMongoObject(user)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Unable to create Wallet, Please try again",
      });
    }

    let foundUserWallet = await EmanagerUserWallet.findOne({
      status: 1,
      userId: user._id,
    });
    if (!isValidMongoObject(foundUserWallet)) {
      // this.res.statusCode = 500;
      // return this.res.json({
      //   success: false,
      //   message: "Wallet not found",
      // });
      foundUserWallet = await this.__createWallet(user);
    }
    try {
      const updateExistingEmanagerUserWalletSession =
        await EmanagerUserWalletSession.updateMany(
          {
            status: 1,
            userId: user._id,
          },
          {
            $set: { status: 0 },
          }
        );
    } catch (err) {
      console.log(err);
    }
    const newlyCreatedUserWalletSession = await new EmanagerUserWalletSession({
      status: 1,
      userId: user._id,
      walletId: foundUserWallet._id,
      createdOn,
    });
    if (!isValidMongoObject(newlyCreatedUserWalletSession)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error creating wallet session",
      });
    }

    const token = generateWalletToken(newlyCreatedUserWalletSession);
    newlyCreatedUserWalletSession.sessionToken = token;
    await newlyCreatedUserWalletSession.save();
    return newlyCreatedUserWalletSession;
    // newlyCreatedUserWalletSession
  }

  async __estateWalletLogin(estate, admin) {
    const createdOn = new Date();
    if (!isValidMongoObject(estate) || !isValidMongoObject(admin)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Unable to create Wallet, Please try again",
      });
    }

    let foundUserWallet = await EmanagerEstateWallet.findOne({
      status: 1,
      userId: estate._id,
    });
    if (!isValidMongoObject(foundUserWallet)) {
      // this.res.statusCode = 500;
      // return this.res.json({
      //   success: false,
      //   message: "Wallet not found",
      // });
      foundUserWallet = await this.__createEstateWallet(estate, admin);
    }
    try {
      const updateExistingEmanagerUserWalletSession =
        await EmanagerUserWalletSession.updateMany(
          {
            status: 1,
            userId: estate._id,
          },
          {
            $set: { status: 0 },
          }
        );
    } catch (err) {
      console.log(err);
    }
    const newlyCreatedEstateWalletSession = await new EmanagerUserWalletSession(
      {
        status: 1,
        userId: estate._id,
        walletId: foundUserWallet._id,
        createdOn,
      }
    );
    if (!isValidMongoObject(newlyCreatedEstateWalletSession)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Error creating wallet session",
      });
    }

    const token = generateWalletToken(newlyCreatedEstateWalletSession);
    newlyCreatedEstateWalletSession.sessionToken = token;
    await newlyCreatedEstateWalletSession.save();
    return newlyCreatedEstateWalletSession;
    // newlyCreatedUserWalletSession
  }

  async __checkWalletBalance() {
    const createdOn = new Date();
    if (!isValidMongoObject(this.res.user)) {
      this.res.statusCode = 401;
      return this.res.json({
        success: false,
        message: "Sorry!!...You are not Authorized",
      });
    }

    const generatedWalletBalance = await this.__generateBalance();
    if (!isValidMongoObject(generatedWalletBalance)) {
      return generatedWalletBalance;
    }

    return this.res.json({
      success: true,
      message: "Balance gotten succesfully",
      balance: generatedWalletBalance,
    });
  }

  async __generateBalance() {
    const userWalletSessionId = this.res.userWalletSessionToken;
    if (!userWalletSessionId || userWalletSessionId.length < 3) {
      this.res.statusCode = 401;
      return this.res.json({
        success: false,
        message:
          "Sorry!!...You don't have an active wallet session Try loging in again",
      });
    }
    const userWalletSessionToken = await EmanagerUserWalletSession.findOne({
      status: 1,
      sessionToken: userWalletSessionId,
    });

    if (!isValidMongoObject(userWalletSessionToken)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message:
          "Sorry!!...You don't have an active wallet session Try loging in again",
      });
    }

    const emanagerUserWalletBalance = await EmanagerUserWalletBalance.findOne({
      status: 1,
      walletId: userWalletSessionToken.walletId,
    });

    if (!isValidMongoObject(emanagerUserWalletBalance)) {
      // to remove ###############################

      const newlyCreatedEmanagerUserWalletBalance =
        await new EmanagerUserWalletBalance({
          status: 1,
          userId: this.res.user._id,
          walletId: userWalletSessionToken.walletId,
          sessionToken: userWalletSessionId,
        });
      if (isValidMongoObject(newlyCreatedEmanagerUserWalletBalance)) {
        await newlyCreatedEmanagerUserWalletBalance.save();
        const updateEmanagerUserWallet = await EmanagerUserWallet.updateOne(
          {
            status: 1,
            walletId: userWalletSessionToken.walletId,
          },
          {
            $set: { balance: newlyCreatedEmanagerUserWalletBalance },
            $push: {
              updates: {
                by: this.res.user._id,
                action: "added default balance",
                timing: createdOn,
              },
            },
          }
        );

        return newlyCreatedEmanagerUserWalletBalance;
      }

      // to remove ###############################
      // this.res.statusCode = 500;
      // return this.res.json({
      //   success: false,
      //   message: "Error Fetching balance",
      // });
    }
    return emanagerUserWalletBalance;
  }
  async __checkEstateWalletBalance() {
    const estate = this.res.estate;
    const admin = this.res.admin;
    const createdOn = new Date();
    if (!isValidMongoObject(estate) || !isValidMongoObject(admin)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Unable to create Wallet, Please try again",
      });
    }
    const estateBalance = await this.__generateEstateBalance();
    if (!isValidMongoObject(estateBalance)) {
      return estateBalance;
    }
    return this.res.json({
      success: true,
      message: "Balance gotten succesfully",
      balance: estateBalance,
    });
  }
  async __generateEstateBalance() {
    const estateWalletSessionId = this.res.estateWalletSessionToken;

    if (!estateWalletSessionId || estateWalletSessionId.length < 3) {
      this.res.statusCode = 401;
      return this.res.json({
        success: false,
        message:
          "Sorry!!...You don't have an active estate wallet session Try loging in again",
      });
    }

    const estateWalletSessionToken = await EmanagerUserWalletSession.findOne({
      status: 1,
      sessionToken: estateWalletSessionId,
    });

    if (!isValidMongoObject(estateWalletSessionToken)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message:
          "Sorry!!...You don't have an active wallet session Try loging in again",
      });
    }

    const emanagerEstateWalletBalance = await EmanagerUserWalletBalance.findOne(
      {
        status: 1,
        walletId: estateWalletSessionToken.walletId,
      }
    );

    if (!isValidMongoObject(emanagerEstateWalletBalance)) {
      // to remove ###############################

      const newlyCreatedEmanagerEstateWalletBalance =
        await new EmanagerUserWalletBalance({
          status: 1,
          userId: estate._id,
          walletId: estateWalletSessionToken.walletId,
          sessionToken: userWalletSessionId,
        });
      if (isValidMongoObject(newlyCreatedEmanagerEstateWalletBalance)) {
        await newlyCreatedEmanagerEstateWalletBalance.save();
        const updateEmanagerEstateWallet = await EmanagerEstateWallet.updateOne(
          {
            status: 1,
            walletId: userWalletSessionToken.walletId,
          },
          {
            $set: { balance: newlyCreatedEmanagerEstateWalletBalance },
            $push: {
              updates: {
                by: this.res.admin._id,
                action: "added estate default balance",
                timing: createdOn,
              },
            },
          }
        );
        return newlyCreatedEmanagerEstateWalletBalance;

        // to remove ###############################
        // this.res.statusCode = 500;
        // return this.res.json({
        //   success: false,
        //   message: "Error Fetching balance",
        // });
      }
    }

    return emanagerEstateWalletBalance;
  }

  async __makeQpayWalletGetRequest(url, payload, message) {
    const createdOn = new Date();
    if (!isValidMongoObject(this.res.user)) {
      this.res.statusCode = 401;
      return this.res.json({
        success: false,
        message: "Sorry!!...You are not Authorized",
      });
    }

    const QpayWalletSession = await this.__checkQpayWalletSession();
    if (!isValidMongoObject(QpayWalletSession)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: " Internal server error, please try again",
      });
    }
    const walletService = await new QpayService(
      url,
      { ...payload, from_emanager: true },
      QpayWalletHeader(QpayWalletSession.jwt)
    ).apiGetRequest();
    // console.log(walletService) 
    if (walletService.status != 200) {
      if (walletService.response && walletService.response.status === 401) {
        await this.__inValidateQpayWalletSessionToken(this.res.user);
      }

      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Internal Server Error",
      });
    } else {
      return this.res.json({
        success: true,
        message: `${message}  gotten successfully`,
        data: walletService.data || {},
      });
    }
  }
  async __makeQpayWalletGetWalletBalanceRequest(url, jwt) {
    const walletService = await new QpayService(
      url,
      { from_emanager: true },
      QpayWalletHeader(jwt)
    ).apiGetRequest();
    return walletService;
  }
  async __makeQpayWalletPostRequest(url, payload, message) {
    const createdOn = new Date();
    if (!isValidMongoObject(this.res.user)) {
      this.res.statusCode = 401;
      return this.res.json({
        success: false,
        message: "Sorry!!...You are not Authorized",
      });
    }

    const QpayWalletSession = await this.__checkQpayWalletSession();
    if (!isValidMongoObject(QpayWalletSession)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: " Internal server error, please try again",
      });
    }

    const walletService = await new QpayService(
      url,
      { ...payload, from_emanager: true },
      QpayWalletHeader(QpayWalletSession.jwt)
    ).apiPostRequest(); 
    if (walletService.status != 200) {
      if (walletService.response && walletService.response.status === 401) {
        await this.__inValidateQpayWalletSessionToken(this.res.user);
      }

      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Internal Server Error",
      });
    } else {
      return this.res.json({
        success: true,
        message: `${message} success`,
        data: walletService.data || {},
      });
    }
  }
  async __makeQpayWalletTransaction(url, payload, message, userBalance) {
    const createdOn = new Date();
    if (!isValidMongoObject(this.res.user)) {
      this.res.statusCode = 401;
      return this.res.json({
        success: false,
        message: "Sorry!!...You are not Authorized",
      });
    }

    const QpayWalletSession = await this.__checkQpayWalletSession();
    if (!isValidMongoObject(QpayWalletSession)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: " Internal server error, please try again",
      });
    }
    const qpaywalletBalance =
      await this.__makeQpayWalletGetWalletBalanceRequest(
        "https://app.scanpay.ng/api/v2/user/wallet-balance",
        QpayWalletSession.jwt
      );

    if (qpaywalletBalance.status != 200) {
      if (walletService.response && walletService.response.status === 401) {
        await this.__inValidateQpayWalletSessionToken(this.res.user);
      }
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Internal Server Error",
      });
    }
    if (
      qpaywalletBalance?.data?.data?.balance < 550 ||
      qpaywalletBalance?.data?.data?.balance < userBalance
    ) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message:
          "Transaction cannot be completed at this time, please try again",
      });
    }
    const walletService = await new QpayService(
      url,
      { ...payload, from_emanager: true },
      QpayWalletHeader(QpayWalletSession.jwt)
    ).apiPostRequest();
    if (walletService.status != 200) {
      if (walletService.response && walletService.response.status === 401) {
        await this.__inValidateQpayWalletSessionToken(this.res.user);
      }

      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Internal Server Error",
      });
    } else {
      return this.res.json({
        success: true,
        message: `${message} success`,
        data: walletService.data || {},
      });
    }
  }

  async __getAirtimeProvider() {
    //
    const newProviderRequest = await this.__makeQpayWalletGetRequest(
      `https://app.scanpay.ng/api/v1/services/airtime/providers`,
      "",
      "Airtime Providers"
    );
    return newProviderRequest;
  }

  async __getDataProviders() {
    //
    const newProviderRequest = await this.__makeQpayWalletGetRequest(
      `https://app.scanpay.ng/api/v1/services/databundle/providers`,
      "",
      "Data Providers"
    );
    return newProviderRequest;
  }
  async __listDataBundles() {
    //
    const serviceType = this.req.params.serviceType || "";

    if (serviceType.length < 2) {
      return this.res.json({
        success: false,
        message: "Provide a valid service type",
      });
    }
    const newProviderRequest = await this.__makeQpayWalletPostRequest(
      `https://app.scanpay.ng/api/v1/services/databundle/bundles`,
      { service_type: serviceType },
      `${serviceType} Data Bundles `
    );
    return newProviderRequest;
  }

  async __getElectricityProvider() {
    //
    const newProviderRequest = await this.__makeQpayWalletGetRequest(
      `https://app.scanpay.ng/api/v1/services/electricity/billers`,
      "",
      "Electricity Providers "
    );
    return newProviderRequest;
  }
  async __getServicesCabletvProviders() {
    //
    const newProviderRequest = await this.__makeQpayWalletGetRequest(
      `https://app.scanpay.ng/api/v1/services/cabletv/providers`,
      "",
      "CableTv Providers "
    );
    return newProviderRequest;
  }
  async __getServicesCableTvMultichoiceList() {
    //
    const serviceType = this.req.params.serviceType || "";

    if (serviceType.length < 2) {
      return this.res.json({
        success: false,
        message: "Provide a valid service type",
      });
    }
    const newProviderRequest = await this.__makeQpayWalletPostRequest(
      `https://app.scanpay.ng/api/v1/services/multichoice/list`,
      {
        service_type: serviceType,
      },
      "cable tv bundle list "
    );
    return newProviderRequest;
  }

  async __getServicesEpinProviders() {
    //
    const newProviderRequest = await this.__makeQpayWalletGetRequest(
      `https://app.scanpay.ng/api/v1/services/epin/providers`,
      "",
      "Epin Providers "
    );
    return newProviderRequest;
  }

  async __getServicesEpinMultichoiceList() {
    //
    const serviceType = this.req.params.serviceType || "";

    if (serviceType.length < 2) {
      return this.res.json({
        success: false,
        message: "Provide a valid service type",
      });
    }
    const newProviderRequest = await this.__makeQpayWalletPostRequest(
      `https://app.scanpay.ng/api/v1/services/epin/bundles`,
      {
        service_type: serviceType,
      },
      "Epin bundle list "
    ); 
    return newProviderRequest;

  }

  async __getBanks() {
    //
    const newProviderRequest = await this.__makeQpayWalletGetRequest(
      `https://app.scanpay.ng/banks`,
      "",
      "Banks"
    );
    return newProviderRequest;
  }

  async __verifyBankAccount(url, payload, message) {
    //
    const accountNumber = this.req.body.accountNumber || "";
    const bankCode = this.req.body.bankCode || "";
    if (isNaN(accountNumber) || accountNumber.length < 10) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid  10 digits account number",
      });
    }
    if (isNaN(bankCode) || bankCode.length < 2) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid bank code",
      });
    }

    const newProviderRequest = await this.__makeQpayWalletPostRequest(
      `https://app.scanpay.ng/api/v2/transaction/account/verify`,
      {
        account_number: accountNumber,
        bank_code: bankCode,
      },
      "Bank Account details gotten"
    );
    return newProviderRequest;
  }
  async __initiateEstateTransaction(url, payload, message) {
    const checkEstateWalletBalance = await this.__generateEstateBalance();
    if (!isValidMongoObject(checkEstateWalletBalance)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Unable to retrieve user wallet balance, try again",
      });
    }

    // if (Number(payload.amount) > Number(checkEstateWalletBalance.value)) {
    //   this.res.statusCode = 409;
    //   return this.res.json({
    //     success: false,
    //     message:
    //       "You don't have sufficient balance to fund this transaction,fund wallet and try again",
    //   });
    // }

    const newProviderRequest = await this.__makeQpayWalletTransaction(
      url,
      payload,
      message,
      checkEstateWalletBalance?.value
    );
    return newProviderRequest;
  }
  async __initiateUserTransaction(url, payload, message) {
    const checkUserWalletBalance = await this.__generateBalance();
    if (!isValidMongoObject(checkUserWalletBalance)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Unable to retrieve user wallet balance, try again",
      });
    }

    if (Number(payload.amount) > Number(checkUserWalletBalance.value)) {
      this.res.statusCode = 409;
      return this.res.json({
        success: false,
        message:
          "You don't have sufficient balance to fund this transaction,fund wallet and try again",
      });
    }

    const newProviderRequest = await this.__makeQpayWalletTransaction(
      url,
      payload,
      message,
      checkUserWalletBalance?.value
    );
    return newProviderRequest;
  }
  async __transferFundsFromEstateWalletToBankAccount() {
    //
    const accountNumber = this.req.body.accountNumber || "";
    const bankCode = this.req.body.bankCode || "";
    const amount = this.req.body.amount || "";
    const description = this.req.body.description || "";
    const password = this.req.body.password || "";

    if (isNaN(accountNumber) || accountNumber.length < 10) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid  10 digits account number",
      });
    }
    if (isNaN(bankCode) || bankCode.length < 2) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid bank code",
      });
    }

    if (isNaN(amount) || amount.length < 2 || Number(amount) < 550) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid amount, minimum amount is 550",
      });
    }
    if (description.length < 3) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid description",
      });
    }
    if (isNaN(password) || password.length < 2) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Provide a valid password",
      });
    }
    const newBankTransfer = await this.__initiateEstateTransaction(
      `https://app.scanpay.ng/api/v2/transaction/account/withdraw-funds`,
      {
        amount: amount,
        pin: password,
        account_number: accountNumber,
        bank_code: bankCode,
        description: description,
      },
      "Fund Transfer"
    );
    return newBankTransfer;
  }

  async __subscribeCableTV() {
    const createdOn = new Date();
    if (!isValidMongoObject(this.res.user)) {
      return this.res.json({
        success: false,
        message: "Sorry!!...You are not Authorized",
      });
    }

    const productCode = this.req.body.productCode || "";
    const amount = this.req.body.totalAmount || "";
    const productMonthsPaidFor = this.req.body.productMonthsPaidFor || "";
    const smartcardNumber = this.req.body.smartcardNumber || "";
    const serviceType = this.req.body.serviceType || "";
    const pin = this.req.body.pin || "";
    const saveAsBeneficiary = this.req.body.saveAsBeneficiary || "";

    if (!isNaN(smartcardNumber) && smartcardNumber.length < 7) {
      return this.res.json({
        success: false,
        message: "Provide a valid smart card number",
      });
    }

    if (!isNaN(accountNumber) && accountNumber.length < 7) {
      return this.res.json({
        success: false,
        message: "Provide a valid account number",
      });
    }

    if (isNaN(amount)) {
      return this.res.json({
        success: false,
        message: "Provide a valid amount",
      });
    }

    if (isNaN(productMonthsPaidFor)) {
      return this.res.json({
        success: false,
        message: "Provide a valid product Months Paid For",
      });
    }

    if (serviceType.length < 1) {
      return this.res.json({
        success: false,
        message: "Provide a valid service type",
      });
    }

    if (!isValidPassword(pin)) {
      return this.res.json({
        success: false,
        message: "Provide a valid pin",
      });
    }

    const walletService = await this.__initiateUserTransaction(
      `https://app.scanpay.ng/api/v1/services/multichoice/request`,
      {
        product_code: productCode,
        total_amount: totalAmount,
        product_monthsPaidFor: productMonthsPaidFor,
        smartcard_number: smartcardNumber,
        service_type: serviceType,
        pin,
        save_as_beneficiary: true,
      },
      "CableTV subscription"
    );

    return walletService;
  }

  async __subscribeEpin() {
    const createdOn = new Date();
    if (!isValidMongoObject(this.res.user)) {
      return this.res.json({
        success: false,
        message: "Sorry!!...You are not Authorized",
      });
    }

    const productCode = this.req.body.productCode || "";
    const amount = this.req.body.totalAmount || "";
    const numberOfPins = this.req.body.numberOfPins || "";
    const pinValue = this.req.body.pinValue || "";
    const serviceType = this.req.body.serviceType || "";
    const pin = this.req.body.pin || "";
    const saveAsBeneficiary = this.req.body.saveAsBeneficiary || "";

    if (isNaN(pinValue)) {
      return this.res.json({
        success: false,
        message: "Provide a valid pin Value",
      });
    }

    if (productCode.length < 2) {
      return this.res.json({
        success: false,
        message: "Provide a valid product Code",
      });
    }

    if (isNaN(amount)) {
      return this.res.json({
        success: false,
        message: "Provide a valid amount",
      });
    }

    if (isNaN(numberOfPins)) {
      return this.res.json({
        success: false,
        message: "Provide a valid number Of Pins",
      });
    }

    if (serviceType.length < 1) {
      return this.res.json({
        success: false,
        message: "Provide a valid service type",
      });
    }

    if (!isValidPassword(pin)) {
      return this.res.json({
        success: false,
        message: "Provide a valid pin",
      });
    }

    const walletService = await this.__initiateUserTransaction(
      `https://app.scanpay.ng/api/v1/services/epin/request`,
      {
        product_code: productCode,
        amount: amount,
        numberOfPins: numberOfPins,
        pinValue: pinValue,
        service_type: serviceType,
        pin,
        // save_as_beneficiary: true,
      },
      "epin request"
    );

    return walletService;
  }
  async __buyAirtime() {
    const createdOn = new Date();
    if (!isValidMongoObject(this.res.user)) {
      return this.res.json({
        success: false,
        message: "Sorry!!...You are not Authorized",
      });
    }

    const amount = this.req.body.amount || "";
    const phone = this.req.body.phone || "";
    const serviceType = this.req.body.serviceType || "";
    const plan = this.req.body.plan || "";
    const pin = this.req.body.pin || "";
    // const saveAsBeneficiary = this.req.body.saveAsBeneficiary || "";

    if (!isValidPhonenumber(phone)) {
      return this.res.json({
        success: false,
        message: "Provide a valid phonenumber",
      });
    }

    if (isNaN(amount)) {
      return this.res.json({
        success: false,
        message: "Provide a valid amount",
      });
    }

    if (serviceType.length < 1) {
      return this.res.json({
        success: false,
        message: "Provide a valid service type",
      });
    }

    if (plan.length < 1) {
      return this.res.json({
        success: false,
        message: "Provide a valid plan",
      });
    }

    if (!isValidPassword(pin)) {
      return this.res.json({
        success: false,
        message: "Provide a valid pin",
      });
    }
    const walletService = await this.__initiateUserTransaction(
      `https://app.scanpay.ng/api/v1/services/epin/request`,
      {
        phone,
        amount,
        service_type: serviceType,
        plan,
        pin,
        save_as_beneficiary: true,
      },
      "airtime request"
    );

    return walletService;
  }

  async __buyData() {
    const createdOn = new Date();
    if (!isValidMongoObject(this.res.user)) {
      return this.res.json({
        success: false,
        message: "Sorry!!...You are not Authorized",
      });
    }

    const amount = this.req.body.amount || "";
    const phone = this.req.body.phone || "";
    const serviceType = this.req.body.service_type || "";
    const datacode = this.req.body.datacode || "";
    const pin = this.req.body.pin || "";
    // const saveAsBeneficiary = this.req.body.saveAsBeneficiary || "";

    if (!isValidPhonenumber(phone)) {
      return this.res.json({
        success: false,
        message: "Provide a valid phonenumber",
      });
    }

    if (isNaN(amount)) {
      return this.res.json({
        success: false,
        message: "Provide a valid amount",
      });
    }

    if (serviceType.length < 1) {
      return this.res.json({
        success: false,
        message: "Provide a valid service type",
      });
    }

    if (isNaN(datacode)) {
      return this.res.json({
        success: false,
        message: "Provide a valid datacode",
      });
    }

    if (!isValidPassword(pin)) {
      return this.res.json({
        success: false,
        message: "Provide a valid pin",
      });
    }

    const walletService = await this.__initiateUserTransaction(
      `https://app.scanpay.ng/api/v1/services/databundle/request`,
      {
        phone,
        amount,
        service_type: serviceType,
        datacode,
        pin,
        save_as_beneficiary: true,
      },
      "databundle request"
    );

    return walletService;
  }

  async __buyElectricity() {
    const createdOn = new Date();
    if (!isValidMongoObject(this.res.user)) {
      return this.res.json({
        success: false,
        message: "Sorry!!...You are not Authorized",
      });
    }

    const amount = this.req.body.amount || "";
    const accountNumber = this.req.body.accountNumber || "";
    const serviceType = this.req.body.serviceType || "";
    const pin = this.req.body.pin || "";
    // const saveAsBeneficiary = this.req.body.save_as_beneficiary || "";

    if (!isNaN(accountNumber) && accountNumber.length < 7) {
      return this.res.json({
        success: false,
        message: "Provide a valid account number",
      });
    }

    if (isNaN(amount)) {
      return this.res.json({
        success: false,
        message: "Provide a valid amount",
      });
    }

    if (serviceType.length < 1) {
      return this.res.json({
        success: false,
        message: "Provide a valid service type",
      });
    }

    if (!isValidPassword(pin)) {
      return this.res.json({
        success: false,
        message: "Provide a valid pin",
      });
    }
    
 

    const walletService = await this.__initiateUserTransaction(
      `https://app.scanpay.ng/api/v1/services/electricity/request`,
      {
        account_number: accountNumber,
        amount,
        service_type: serviceType,
        pin,
        // save_as_beneficiary: true,
      },
      "electricity request"
    );

    return walletService;
  }

  async __getUserWalletTransaction() {
    const createdOn = new Date();
    if (!isValidMongoObject(this.res.user)) {
      return this.res.json({
        success: false,
        message: "Sorry!!...You are not Authorized",
      });
    }

    const userWalletTransaction = await UserWalletTransaction.find({
      status: 1,
      ownerId: this.res.user._id,
    });

    if (!isValidArrayOfMongoObject(userWalletTransaction)) {
      return this.res.json({
        success: false,
        message: ` Transactions not gotten`,
      });
    }

    return this.res.json({
      success: true,
      message: `  Transaction gotten successfully`,
      data: userWalletTransaction || [],
    });
  }
  async __checkQpayWalletSession() {
    const createdOn = new Date();
    const foundWalletToken = await QpayWalletSessionToken.findOne({
      status: 1,
    });

    if (!isValidMongoObject(foundWalletToken)) {
      const emanagerWalletLogin = await this.qpayWallet.__walletLogin({
        phone: "+2348132331814",
        pin: "1994",
      });
      if (
        emanagerWalletLogin.data &&
        emanagerWalletLogin.data.status &&
        stringIsEqual(emanagerWalletLogin.data.status, "success")
      ) {
        const walletData = emanagerWalletLogin.data.data;
        const userWalletSession = await new QpayWalletSession({
          status: 1,
          walletId: walletData._id,
          email: walletData.email,
          bankCode: walletData.bank_code,
          walletUserId: walletData.user_id,
          code: walletData.code,
          fullName: walletData.full_name,
          error: walletData.error,
          message: walletData.message,
          address: walletData.address,
          success: walletData.success,
          balance: walletData.balance,
          isVerified: walletData.isVerified, //true//false
          reference: walletData.reference,
          referralCode: walletData.referral_code,
          cardDetails: walletData.card_details,
          createdOn,
        });

        if (isValidMongoObject(userWalletSession)) {
          await userWalletSession.save();
        }
        const userWalletSessionToken = await new QpayWalletSessionToken({
          status: 1,
          jwt: walletData.jwt,
          walletId: userWalletSession._id,
          token: walletData.token,
          tokenExpires: walletData.token_expires,
          createdOn,
        });

        if (isValidMongoObject(userWalletSessionToken)) {
          await userWalletSessionToken.save();
          return userWalletSessionToken;
        }
      } else {
        return;
      }
    }

    return foundWalletToken;
  }
  async __checkEmanagerWalletSession() {
    const createdOn = new Date();
    const foundWalletToken = await EmanagerWalletSession.findOne({
      status: 1,
    });

    if (!isValidMongoObject(foundWalletToken)) {
      const emanagerWalletLogin = await this.qpayWallet.__walletLogin({
        phone: "+2348132331814",
        pin: "1994",
      });
      if (
        emanagerWalletLogin.data &&
        emanagerWalletLogin.data.status &&
        stringIsEqual(emanagerWalletLogin.data.status, "success")
      ) {
        const walletData = emanagerWalletLogin.data.data;
        const userWalletSession = await new QpayWalletSession({
          status: 1,
          walletId: walletData._id,
          email: walletData.email,
          bankCode: walletData.bank_code,
          walletUserId: walletData.user_id,
          code: walletData.code,
          fullName: walletData.full_name,
          error: walletData.error,
          message: walletData.message,
          address: walletData.address,
          success: walletData.success,
          balance: walletData.balance,
          isVerified: walletData.isVerified, //true//false
          reference: walletData.reference,
          referralCode: walletData.referral_code,
          cardDetails: walletData.card_details,
          createdOn,
        });

        if (isValidMongoObject(userWalletSession)) {
          await userWalletSession.save();
        }
        const userWalletSessionToken = await new QpayWalletSessionToken({
          status: 1,
          jwt: walletData.jwt,
          walletId: userWalletSession._id,
          token: walletData.token,
          tokenExpires: walletData.token_expires,
          createdOn,
        });

        if (isValidMongoObject(userWalletSessionToken)) {
          await userWalletSessionToken.save();
          return userWalletSessionToken;
        }
      } else {
        return;
      }
    }

    return foundWalletToken;
  }

  async __inValidateQpayWalletSessionToken(user) {
    const createdOn = new Date();
    try {
      const updatablePush = {
        updates: {
          by: this.res.user._id, // admin ID of the admin who made this update
          action: 0, //0:delete,
          timing: createdOn,
        },
      };
      const updateAllUserWalletToken = await QpayWalletSessionToken.updateMany(
        {
          status: 1,
          // ownerId: this.res.user._id,
        },
        {
          $set: {
            status: 0,
          },
          $push: updatablePush,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  async __inValidateEmanagerUserWalletSession(user) {
    const createdOn = new Date();
    try {
      const updatablePush = {
        updates: {
          by: this.res.user._id, // admin ID of the admin who made this update
          action: 0, //0:delete,
          timing: createdOn,
        },
      };
      const updateAllUserWalletToken =
        await EmanagerUserWalletSession.updateMany(
          {
            status: 1,
            ownerId: this.res.user._id,
          },
          {
            $set: {
              status: 0,
            },
            $push: updatablePush,
          }
        );
    } catch (error) {
      console.log(error);
    }
  }

  async __viewEmanagerEstateTransaction() {
    const createdOn = new Date();
    const estateTransaction = await UserWalletTransaction.find(
      {
        status: 1,
      },
      {
        _id: 1,
        name: 1,
        status: 1,
        type: 1,
        amount: 1,
        isDebit: 1,
        createdOn: 1,
        message: 1,
      }
    );
    if (!isValidArrayOfMongoObject(estateTransaction)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Unable to get transactions",
      });
    }
    return this.res.json({
      success: true,
      message: `  Transaction gotten successfully`,
      data: estateTransaction || [],
    });

    return foundWalletToken;
  }
  async __viewParticularEmanagerEstateTransaction() {
    const createdOn = new Date();
    const { transactionId } = this.req.params;

    if (!isValidMongoObjectId(transactionId)) {
      this.res.statusCode = 400;
      return this.res.json({
        success: false,
        message: "Invalid  transaction id",
      });
    }
    const estateTransaction = await UserWalletTransaction.findOne(
      {
        status: 1,
        _id: transactionId,
      },
      {
        _id: 1,
        name: 1,
        status: 1,
        type: 1,
        amount: 1,
        isDebit: 1,
        createdOn: 1,
        message: 1,
      }
    );
    if (!isValidMongoObject(estateTransaction)) {
      this.res.statusCode = 500;
      return this.res.json({
        success: false,
        message: "Unable to get transactions",
      });
    }
    return this.res.json({
      success: true,
      message: `  Transaction gotten successfully`,
      data: estateTransaction || [],
    });

    return foundWalletToken;
  }
}
module.exports = EmanagerWallet;
