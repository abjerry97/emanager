const Authentication = require("../Modules/Authentication/auth");
const Estate = require("../Modules/Estate/Estate");
const Visitor = require("../Modules/Visitor/Visitor");
const Admin = require("../Modules/Admin/Admin");
const Security = require("../Modules/Security/Security");
const Resident = require("../Modules/Resident/Resident");
const Services = require("../Modules/Services/Services");
const Properties = require("../Modules/Properties/Properties");
const Notification = require("../Modules/Notification/Notification");
const Foods = require("../Modules/Foods/Foods");
const Goods = require("../Modules/Goods/Goods");
const Suggestion = require("../Modules/Suggestion/Suggestion");
const Bill = require("../Modules/Bill/Bill");
const Emergency = require("../Modules/Emergency/Emergency");
const Wallet = require("../Modules/QpayWallet/QpayWallet");
const PortalAuthentication = require("../Modules/PortalAuthentication/portalauth");
const Houses = require("../Modules/Houses/Houses");
const PortalAdmin = require("../Modules/PortalAdmin/PortalAdmin");
const PortalAds = require("../Modules/PortalAds/PortalAds");
const VerifyAccounts = require("../Modules/VerifyAccounts/VerifyAccounts");
const EmanagerWallet = require("../Modules/EmanagerWallet/EmanagerWallet");

class Controller {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async adminLogin() {
    return await new Authentication(
      this.req,
      this.res,
      this.next
    ).__adminLogin();
  }
  async adminCreate() {
    return await new Admin(this.req, this.res, this.next).__createAdmin();
  }
  async getAdminUpdateCount() {
    return await new Admin(this.req, this.res, this.next).__getAdminUpdateCount();
  } 
  async getAdmins() {
    return await new Admin(this.req, this.res, this.next).__getAdmins();
  }
  async getAdmin() {
    return await new Admin(this.req, this.res, this.next).__getAdmin();
  }
  async editAdmin() {
    return await new Admin(this.req, this.res, this.next).__editAdmin();
  }
  async createElection() {
    return await new Admin(this.req, this.res, this.next).__createElection();
  }
  async createElectionCandidate() {
    return await new Admin(
      this.req,
      this.res,
      this.next
    ).__createElectionCandidate();
  }
  async getElectionResult() {
    return await new Admin(this.req, this.res, this.next).__getElectionResult();
  }

  async getActiveElections() {
    return await new Admin(
      this.req,
      this.res,
      this.next
    ).__getActiveElections();
  }

  async getActiveCandidates() {
    return await new Admin(
      this.req,
      this.res,
      this.next
    ).__getActiveCandidates();
  }

  async getAllCandidates() {
    return await new Admin(this.req, this.res, this.next).__getAllCandidates();
  }

  async updateAdminUser() {
    return await new Admin(this.req, this.res, this.next).__updateAdminUser();
  }

  async updateAllUser() {
    return await new Admin(this.req, this.res, this.next).__updateAllUser();
  }

  async getAllUserCandidates() {
    return await new Resident(
      this.req,
      this.res,
      this.next
    ).__getActiveCandidates();
  }
  async voteCandidate() {
    return await new Resident(this.req, this.res, this.next).__voteCandidate();
  }
  async getAllUserEstates() {
    return await new Resident(
      this.req,
      this.res,
      this.next
    ).__getAllUserEstates();
  }
  async __deleteUserEstates() {
    return await new Resident(
      this.req,
      this.res,
      this.next
    ).__deleteUserEstates();
  }
  
  async addUserEstates() {
    return await new Resident(this.req, this.res, this.next).__addUserEstates();
  }

  async switchUserEstates() {
    return await new Resident(
      this.req,
      this.res,
      this.next
    ).__switchUserEstates();
  }

  async endElection() {
    return await new Admin(this.req, this.res, this.next).__endElection();
  }

  async createBusiness() {
    return await new Services(this.req, this.res, this.next).__createBusiness();
  }

  async addBusinessAddress() {
    return await new Services(
      this.req,
      this.res,
      this.next
    ).__addBusinessAddress();
  }

  async addBusinessImage() {
    return await new Services(
      this.req,
      this.res,
      this.next
    ).__addBusinessImage();
  }
  async addDefaultBusinessImage() {
    return await new Services(
      this.req,
      this.res,
      this.next
    ).__addDefaultBusinessImage();
  }
  async getEstateBusiness() {
    return await new Services(
      this.req,
      this.res,
      this.next
    ).__getEstateBusiness();
  }

  async getBusiness() {
    return await new Services(this.req, this.res, this.next).__getBusiness();
  }
  async getParticularBusiness() {
    return await new Services(this.req, this.res, this.next).__getParticularBusiness();
  }
  
  async deleteBusiness() {
    return await new Admin(this.req, this.res, this.next).__deleteBusiness();
  }
  

  async getBusinessPostPrice() {
    return await new Services(
      this.req,
      this.res,
      this.next
    ).__getBusinessPostPrice();
  }
  async updateBusinessPostPrice() {
    return await new Services(
      this.req,
      this.res,
      this.next
    ).__updateBusinessPostPrice();
  }
  
  async createService() {
    return await new Services(this.req, this.res, this.next).__createService();
  }

  async addServiceImage() {
    return await new Services(
      this.req,
      this.res,
      this.next
    ).__addServiceImage();
  }
  async addDefaultServiceImage() {
    return await new Services(
      this.req,
      this.res,
      this.next
    ).__addDefaultServiceImage();
  }
  async getEstateServices() {
    return await new Services(
      this.req,
      this.res,
      this.next
    ).__getEstateServices();
  }
  async getParticularService() {
    return await new Services(
      this.req,
      this.res,
      this.next
    ).__getParticularService();
  }

  async getServices() {
    return await new Services(this.req, this.res, this.next).__getServices();
  }



  async getServicePostPrice() {
    return await new Services(
      this.req,
      this.res,
      this.next
    ).__getServicePostPrice();
  }
  async updateServicePostPrice() {
    return await new Services(
      this.req,
      this.res,
      this.next
    ).__updateServicePostPrice();
  }
  




  
  async deleteService() {
    return await new Admin(this.req, this.res, this.next).__deleteService();
  }
  

  
  async addProperty() {
    return await new Properties(this.req, this.res, this.next).__addProperty();
  }
  async rateProperty() {
    return await new Properties(this.req, this.res, this.next).__rateProperty();
  }
  async getProperty() {
    return await new Properties(this.req, this.res, this.next).__getProperty();
  }
  async findProperty() {
    return await new Properties(this.req, this.res, this.next).__findProperty();
  }

  async addPropertyToFavourite() {
    return await new Properties(
      this.req,
      this.res,
      this.next
    ).__addPropertyToFavourite();
  }

  async removePropertyFromFavourite() {
    return await new Properties(
      this.req,
      this.res,
      this.next
    ).__removePropertyFromFavourite();
  }
  async getUserEstatePropertyFavourite() {
    return await new Properties(
      this.req,
      this.res,
      this.next
    ).__getUserEstatePropertyFavourite();
  }
  async getEstateProperty() {
    return await new Properties(
      this.req,
      this.res,
      this.next
    ).__getEstateProperty();
  }
  async updateProperty() {
    return await new Properties(
      this.req,
      this.res,
      this.next
    ).__updateProperty();
  }
  async deleteEstateProperty() {
    return await new Properties(
      this.req,
      this.res,
      this.next
    ).__deleteEstateProperty();
  }

  async createBills() {
    return await new Bill(this.req, this.res, this.next).__createBills();
  }

  async getUserEstateBills() {
    return await new Bill(this.req, this.res, this.next).__getUserEstateBills();
  }

  async getUserBillsLinking() {
    return await new Bill(
      this.req,
      this.res,
      this.next
    ).__getUserBillsLinking();
  }

  async getUserUpcomingBills() {
    return await new Bill(
      this.req,
      this.res,
      this.next
    ).__getUserUpcomingBills();
  }

  async userPayBills() {
    return await new Bill(this.req, this.res, this.next).__userPayBills();
  }
  async getBill() {
    return await new Bill(this.req, this.res, this.next).__getBill();
  }
  async getBills() {
    return await new Bill(this.req, this.res, this.next).__getBills();
  }
  async updateBill() {
    return await new Bill(this.req, this.res, this.next).__updateBill();
  }
  async adminGetUserBillPayments() {
    return await new Bill(this.req, this.res, this.next).__adminGetUserBillPayments();
  }
  async adminGetUserParticularBillPayment() {
    return await new Bill(this.req, this.res, this.next).__adminGetUserParticularBillPayment();
  }
  
  async addEmergencyDetails() {
    return await new Emergency(
      this.req,
      this.res,
      this.next
    ).__addEmergencyDetails();
  }
  async getEmergencyDetails() {
    return await new Emergency(
      this.req,
      this.res,
      this.next
    ).__getEmergencyDetails();
  }
  async deleteEmergencyDetails() {
    return await new Emergency(
      this.req,
      this.res,
      this.next
    ).__deleteEmergencyDetails();
  }
  
  
  async userActivateEmergency() {
    return await new Emergency(
      this.req,
      this.res,
      this.next
    ).__userActivateEmergency();
  }

  async getUserEmergencyMode() {
    return await new Emergency(
      this.req,
      this.res,
      this.next
    ).__getUserEmergencyMode();
  }

  async userGetNotication() {
    return await new Notification(
      this.req,
      this.res,
      this.next
    ).__userGetNotication();
  }

  async userGetNoticationLinking() {
    return await new Notification(
      this.req,
      this.res,
      this.next
    ).__userGetNoticationLinking();
  }

  async adminCreateForum() {
    return await new Notification(
      this.req,
      this.res,
      this.next
    ).__adminCreateForum();
  }

  async addFood() {
    return await new Foods(this.req, this.res, this.next).__addFood();
  }

  async getFoods() {
    return await new Foods(this.req, this.res, this.next).__getFoods();
  }
  async findFood() {
    return await new Foods(this.req, this.res, this.next).__findFood();
  }
  async rateFood() {
    return await new Foods(this.req, this.res, this.next).__rateFood();
  }
  async addFoodToFavourite() {
    return await new Foods(
      this.req,
      this.res,
      this.next
    ).__addFoodToFavourite();
  }

  async removeFoodFromFavourite() {
    return await new Foods(
      this.req,
      this.res,
      this.next
    ).__removeFoodFromFavourite();
  }
  async getUserEstateFoodFavourite() {
    return await new Foods(
      this.req,
      this.res,
      this.next
    ).__getUserEstateFoodFavourite();
  }
  async getEstateFoods() {
    return await new Foods(this.req, this.res, this.next).__getEstateFoods();
  }
  async deleteFood() {
    return await new Foods(this.req, this.res, this.next).__deleteFood();
  }

  async addGood() {
    return await new Goods(this.req, this.res, this.next).__addGood();
  }

  async getGoods() {
    return await new Goods(this.req, this.res, this.next).__getGoods();
  }
  async findGood() {
    return await new Goods(this.req, this.res, this.next).__findGood();
  }

  async addGoodToFavourite() {
    return await new Goods(
      this.req,
      this.res,
      this.next
    ).__addGoodToFavourite();
  }

  async rateGood() {
    return await new Goods(this.req, this.res, this.next).__rateGood();
  }
  async removeGoodFromFavourite() {
    return await new Goods(
      this.req,
      this.res,
      this.next
    ).__removeGoodFromFavourite();
  }
  async getUserEstateGoodFavourite() {
    return await new Goods(
      this.req,
      this.res,
      this.next
    ).__getUserEstateGoodFavourite();
  }
  async getEstateGoods() {
    return await new Goods(this.req, this.res, this.next).__getEstateGoods();
  }
  async deleteGood() {
    return await new Goods(this.req, this.res, this.next).__deleteGood();
  }
  async findGoodByID() {
    return await new Goods(this.req, this.res, this.next).__findGoodByID();
  }
  
 
  async getGoodPostPrice() {
    return await new Goods(
      this.req,
      this.res,
      this.next
    ).__getGoodPostPrice();
  }



  
  async updateGoodPostPrice() {
    return await new Goods(
      this.req,
      this.res,
      this.next
    ).__updateGoodPostPrice();
  }






  async getAdminDetails() {
    return await new Admin(this.req, this.res, this.next).__getAdminDetails();
  }
  async deleteAdmin() {
    return await new Admin(this.req, this.res, this.next).__deleteAdmin();
  }
  async createTopmostAdmin() {
    return await new Authentication(
      this.req,
      this.res,
      this.next
    ).__createTopmostAdmin();
  }
  async createFamilyMember() {
    return await new Resident(
      this.req,
      this.res,
      this.next
    ).__createFamilyMember();
  }
  async editFamilyMember() {
    return await new Resident(
      this.req,
      this.res,
      this.next
    ).__editFamilyMember();
  }

  async deleteFamilyMember() {
    return await new Resident(
      this.req,
      this.res,
      this.next
    ).__deleteFamilyMember();
  }
  async getEstateFamilyMember() {
    return await new Resident(
      this.req,
      this.res,
      this.next
    ).__getEstateFamilyMember();
  }

  async getCurrentEstate() {
    return await new Resident(
      this.req,
      this.res,
      this.next
    ).__getCurrentEstate();
  }


  
  async editUserProfile() {
    return await new Resident(
      this.req,
      this.res,
      this.next
    ).__editUserProfile();
  }

  async toggleTravelMode() {
    return await new Resident(
      this.req,
      this.res,
      this.next
    ).__toggleTravelMode();
  }
  async getTravelMode() {
    return await new Resident(this.req, this.res, this.next).__getTravelMode();
  }

  async getResidentUpdateCount() {
    return await new Resident(
      this.req,
      this.res,
      this.next
    ).__getResidentUpdateCount();
  }

  async userReadNotice() {
    return await new Notification(
      this.req,
      this.res,
      this.next
    ).__userReadNotice();
  }

  async userCreateSuggestion() {
    return await new Suggestion(
      this.req,
      this.res,
      this.next
    ).__userCreateSuggestion();
  }

  async userLogin() {
    return await new Authentication(
      this.req,
      this.res,
      this.next
    ).__userLogin();
  }
  async createSecurity() {
    return await new Admin(this.req, this.res, this.next).__createSecurity();
  }

  async securityLogin() {
    return await new Authentication(
      this.req,
      this.res,
      this.next
    ).__securityLogin();
  }
  async userRegister() {
    return await new Authentication(
      this.req,
      this.res,
      this.next
    ).__userRegister();
  }
  async userInfo() {
    return await new Authentication(this.req, this.res, this.next).__userInfo();
  }

  async createGuest(type) {
    return await new Visitor(this.req, this.res, this.next).__createGuest(type);
  }
  async updateGuest() {
    return await new Visitor(this.req, this.res, this.next).__updateGuest();
  }

  async checkPass() {
    return await new Security(this.req, this.res, this.next).__checkPass();
  }

  async confirmPass() {
    return await new Security(this.req, this.res, this.next).__confirmPass();
  }

  async guestInfo() {
    return await new Authentication(
      this.req,
      this.res,
      this.next
    ).__guestInfo();
  }

  async getPasses() {
    return await new Visitor(this.req, this.res, this.next).__getAllPasses();
  }
  async sendPass() {
    return await new Visitor(this.req, this.res, this.next).__sendPass();
  }
  async invalidatePasses() {
    return await new Visitor(this.req, this.res, this.next).__invalidatePass();
  }
  async getGuests() {
    return await new Visitor(this.req, this.res, this.next).__getAllGuests();
  }
  async adminInfo() {
    return await new Authentication(
      this.req,
      this.res,
      this.next
    ).__adminInfo();
  }
  async createEstate() {
    return await new Estate(this.req, this.res, this.next).__createEstate();
  }

 
  async findEstates() {
    return await new Estate(this.req, this.res, this.next).__findAllEstates();
  }

  // async createWallet() {
  //   return await new Wallet(this.req, this.res, this.next).__createWallet();
  // }
  // async getUserWalletTransaction() {
  //   return await new Wallet(
  //     this.req,
  //     this.res,
  //     this.next
  //   ).__getUserWalletTransaction();
  // }

  async getWalletBalance() {
    return await new EmanagerWallet(
      this.req,
      this.res,
      this.next
    ).__checkWalletBalance();
  }
  async getEstateWalletBalance() {
    return await new EmanagerWallet(
      this.req,
      this.res,
      this.next
    ).__checkEstateWalletBalance();
  }
  
  async getAirtimeProvider() {
    return await new EmanagerWallet(
      this.req,
      this.res,
      this.next
    ).__getAirtimeProvider();
  }
  
  async getBanks() {
    return await new EmanagerWallet(
      this.req,
      this.res,
      this.next
    ).__getBanks();
  }

  async  verifyBankAccount() {
    return await new EmanagerWallet(
      this.req,
      this.res,
      this.next
    ).__verifyBankAccount();
  }
  async  __transferFundsFromEstateWalletToBankAccount() {
    return await new EmanagerWallet(
      this.req,
      this.res,
      this.next
    ).__transferFundsFromEstateWalletToBankAccount();
  }

  
  
  async viewEmanagerEstateTransaction() {
    return await new EmanagerWallet(
      this.req,
      this.res,
      this.next
    ).__viewEmanagerEstateTransaction();
  }
  async viewParticularEmanagerEstateTransaction() {
    return await new EmanagerWallet(
      this.req,
      this.res,
      this.next
    ).__viewParticularEmanagerEstateTransaction();
  }
  
  async buyAirtime() {
    return await new EmanagerWallet(this.req, this.res, this.next).__buyAirtime();
  }
  async getDataProviders() {
    return await new EmanagerWallet(this.req, this.res, this.next).__getDataProviders();
  }
  async listDataBundles() {
    return await new EmanagerWallet(this.req, this.res, this.next).__listDataBundles();
  }

  async buyData() {
    return await new EmanagerWallet(this.req, this.res, this.next).__buyData();
  }

  async getElectricityProvider() {
    return await new EmanagerWallet(
      this.req,
      this.res,
      this.next
    ).__getElectricityProvider();
  }

  async buyElectricity() {
    return await new EmanagerWallet(this.req, this.res, this.next).__buyElectricity();
  }

  async getServicesCabletvProviders() {
    return await new EmanagerWallet(
      this.req,
      this.res,
      this.next
    ).__getServicesCabletvProviders();
  }

  async getServicesCableTvMultichoiceList() {
    return await new EmanagerWallet(
      this.req,
      this.res,
      this.next
    ).__getServicesCableTvMultichoiceList();
  }

  async subscribeCableTV() {
    return await new EmanagerWallet(this.req, this.res, this.next).__subscribeCableTV();
  }
  async getServicesEpinProviders() {
    return await new EmanagerWallet(
      this.req,
      this.res,
      this.next
    ).__getServicesEpinProviders();
  }

  async getServicesEpinMultichoiceList() {
    return await new EmanagerWallet(
      this.req,
      this.res,
      this.next
    ).__getServicesEpinMultichoiceList();
  }

  async subscribeEpin() {
    return await new EmanagerWallet(this.req, this.res, this.next).__subscribeEpin();
  }

  async portalUserRegister() {
    return await new PortalAuthentication(
      this.req,
      this.res,
      this.next
    ).__portalUserRegister();
  }
  async portalUserLogin() {
    return await new PortalAuthentication(
      this.req,
      this.res,
      this.next
    ).__portalUserLogin();
  }
  async portalOverview() {
    return await new PortalAdmin(
      this.req,
      this.res,
      this.next
    ).__portalOverview();
  }

  async getPortalProperty() {
    return await new PortalAdmin(
      this.req,
      this.res,
      this.next
    ).__getPortalProperty();
  }

  async deletePortalEstateProperty() {
    return await new PortalAdmin(
      this.req,
      this.res,
      this.next
    ).__deletePortalEstateProperty();
  }

  async getPortalFoods() {
    return await new PortalAdmin(
      this.req,
      this.res,
      this.next
    ).__getPortalFoods();
  }

  async deletePortalEstateFood() {
    return await new PortalAdmin(
      this.req,
      this.res,
      this.next
    ).__deletePortalEstateFood();
  }

  async getPortalGoods() {
    return await new PortalAdmin(
      this.req,
      this.res,
      this.next
    ).__getPortalGoods();
  }

  async specialUpdateonGood() {
    return await new Goods(
      this.req,
      this.res,
      this.next
    ).__specialUpdateonGood();
  }



  
  async deletePortalEstateFood() {
    return await new PortalAdmin(
      this.req,
      this.res,
      this.next
    ).__deletePortalEstateFood();
  }



  
  async findFoodByID() {
    return await new Foods(
      this.req,
      this.res,
      this.next
    ).__findFoodByID();
  }

  




  async __specialUpdateonFood() {
    return await new Foods(
      this.req,
      this.res,
      this.next
    ).__specialUpdateonFood();
  }

  
  async getFoodPostPrice() {
    return await new Foods(
      this.req,
      this.res,
      this.next
    ).__getFoodPostPrice();
  }



  
  async updateFoodPostPrice() {
    return await new Foods(
      this.req,
      this.res,
      this.next
    ).__updateFoodPostPrice();
  }










  async getPortalBusiness() {
    return await new PortalAdmin(
      this.req,
      this.res,
      this.next
    ).__getPortalBusiness();
  }

  async getPortalServices() {
    return await new PortalAdmin(
      this.req,
      this.res,
      this.next
    ).__getPortalServices();
  }

  async createPostAd() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__createPostAd();
  }
 
  async confirmPostAdCheckout() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__confirmPostAdCheckout();
  }
 
  
  async findAllPostAd() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__findAllPostAd();
  }
  async getPropertyLocations() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__getPropertyLocations();
  }
 
  async  findPropertyAdsByID() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__findPropertyAdsByID();
  }
  async  getPropertyCategory() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__getPropertyCategory();
  }
  async  deletePropertyAd() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__deletePropertyAd();
  }
  // async createPropertyPostPrice() {
  //   return await new PortalAds(
  //     this.req,
  //     this.res,
  //     this.next
  //   ).__createPropertyPostPrice();
  // }

  async getPropertyPostPrice() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__getPropertyPostPrice();
  }



  
  async updatePropertyPostPrice() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__updatePropertyPostPrice();
  }
  async adminApproveProperty() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__adminApproveProperty();
  }
  

  async getUserProperties() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__getUserProperties();
  }
  
  async getUserParticularProperty() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__getUserParticularProperty();
  }
  
  async getUserPropertyAds() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__getUserPropertyAds();
  }
  


  async getUserParticularPropertyAd() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__getUserParticularPropertyAd();
  }
  

  async publishPropertyAd() {
    return await new PortalAds(
      this.req,
      this.res,
      this.next
    ).__publishPropertyAd();
  }
  

  
  


  async findPropertyByID() {
    return await new Properties(
      this.req,
      this.res,
      this.next
    ).__findPropertyByID();
  }
 
  
  async createHouse() {
    return await new Houses(this.req, this.res, this.next).__createHouse();
  }
  async deleteEstateHouse() {
    return await new Houses(
      this.req,
      this.res,
      this.next
    ).__deleteEstateHouse();
  }
  async getHouses() {
    return await new Houses(this.req, this.res, this.next).__getHouses();
  }

  async logout() {
    return await new Authentication(this.req, this.res, this.next).__logout();
  }





  async verifyEmail() {
    return await new VerifyAccounts(this.req, this.res, this.next).__verifyEmail();
  }
  
}
module.exports = Controller;
