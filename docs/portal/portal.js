/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome to e manager!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */

/**
 * @swagger
 *  paths:
 *  /login:
 *    post:
 *      summary: Login as either admin or user!.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: email
 *          type: email
 *          description: A user's  email.
 *        - in: formData
 *          name: password
 *          type: number
 *          description: A user's  pin (numeric 4 value).
 *      responses:
 *        200:
 *          description: Returns user details
 */

/**
 * @swagger
 *  paths:
 *  /register:
 *    post:
 *      summary: add a new resident.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: firstname
 *          type: string
 *          description: new user's firstname.
 *        - in: formData
 *          name: lastname
 *          type: string
 *          description: new user's lastname.
 *        - in: formData
 *          name: phone
 *          type: number
 *          description: A new user's phone number.
 *        - in: formData
 *          name: email
 *          type: email
 *          description: A new user's email.
 *        - in: formData
 *          name: password
 *          type: number
 *          description: A new user's password (numeric 4 value).
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 * /config:
 *   get:
 *     description: get config json!
 *     responses:
 *       200:
 *         description: get config json.
 */

/**
 * @swagger
 * /overview:
 *   get:
 *     description: get a brief overview of availiable details for admin!
 *     responses:
 *       200:
 *         description: get config json.
 */

/**
 * @swagger
 * /estates?page=1&pageSize=4&name="":
 *   get:
 *     description: get list of avaliable estates!
 *     responses:
 *       200:
 *         description: get estate file.
 */

/**
 * @swagger
 *  paths:
 *  /admins/create:
 *    post:
 *      summary: add a new Admin.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: query
 *          name: estateId
 *          required: true
 *          type: string
 *        - in: formData
 *          name: name
 *          type: string
 *          description: new Admin name.
 *        - in: formData
 *          name: phone
 *          type: number
 *          description: A new Admin phone number.
 *        - in: formData
 *          name: email
 *          type: email
 *          description: A new Admin email.
 *        - in: formData
 *          name: password
 *          type: number
 *          description: A new Admin password (numeric 4 value).
 *        - in: formData
 *          name: excoRole
 *          type: string
 *          description: A new Admin excoRole.
 *        - in: formData
 *          name: officeAddress
 *          type: string
 *          description: A new Admin office Address.
 *        - in: formData
 *          name: officeName
 *          type: string
 *          description: A new Admin office Name.
 *        - in: formData
 *          name: officePhoneNumber
 *          type: string
 *          description: A new Admin office PhoneNumber.
 *        - in: formData
 *          name: officeEmail
 *          type: string
 *          description: A new Admin office Email.
 *        - in: formData
 *          name: guarantorName
 *          type: string
 *          description: A new Admin guarantor Name.
 *        - in: formData
 *          name: guarantorPhoneNumber
 *          type: string
 *          description: A new Admin guarantor PhoneNumber.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 * /admins:
 *   get:
 *     description: get all availiable admins!
 *     responses:
 *       200:
 *         description: Returns found admins.
 */

/**
 * @swagger
 * /admins/:adminId:
 *   get:
 *     description: view a particular  admin under your estate!
 *     responses:
 *       200:
 *         description: view a particular  admin under your estate.
 */

/**
 * @swagger
 * /admins/:adminId/details:
 *   get:
 *     description: view a particular  admin details under your estate!
 *     responses:
 *       200:
 *         description: view a particular  admin details under your estate.
 */
/**
 * @swagger
 * /admins/:adminId:
 *   delete:
 *     description: delete a particular  admin details under your estate!
 *     responses:
 *       200:
 *         description: delete a particular  admin details under your estate.
 */

/**
 * @swagger
 *  paths:
 *  /admins/:adminId/edit:
 *    put:
 *      summary: Edit an Admin.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: query
 *          name: estateId
 *          required: true
 *          type: string
 *        - in: formData
 *          name: name
 *          type: string
 *          description: new Admin name.
 *        - in: formData
 *          name: phone
 *          type: number
 *          description: A new Admin phone number.
 *        - in: formData
 *          name: email
 *          type: email
 *          description: A new Admin email.
 *        - in: formData
 *          name: password
 *          type: number
 *          description: A new Admin password (numeric 4 value).
 *        - in: formData
 *          name: excoRole
 *          type: string
 *          description: A new Admin excoRole.
 *        - in: formData
 *          name: officeAddress
 *          type: string
 *          description: A new Admin office Address.
 *        - in: formData
 *          name: officeName
 *          type: string
 *          description: A new Admin office Name.
 *        - in: formData
 *          name: officePhoneNumber
 *          type: string
 *          description: A new Admin office PhoneNumber.
 *        - in: formData
 *          name: officeEmail
 *          type: string
 *          description: A new Admin office Email.
 *        - in: formData
 *          name: guarantorName
 *          type: string
 *          description: A new Admin guarantor Name.
 *        - in: formData
 *          name: guarantorPhoneNumber
 *          type: string
 *          description: A new Admin guarantor PhoneNumber.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /business:
 *    get:
 *      summary: get business .
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /business:businessId/delete:
 *    delete:
 *      summary: delete business .
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /business/:businessId:
 *    get:
 *      summary: get  business .
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services:
 *    get:
 *      summary: get services .
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /service:serviceId/delete:
 *    delete:
 *      summary: delete service .
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /properties/delete:
 *    delete:
 *      summary: delete properties.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: propertyId
 *          type: string
 *          description: delete properties.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /foods:
 *    get:
 *      summary: get foods .
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /foods/delete:
 *    delete:
 *      summary: delete food.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: foodId
 *          type: string
 *          description: delete food.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /foods/:foodId:
 *    get:
 *      summary: get good by Id.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /goods:
 *    get:
 *      summary: get goods .
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /goods/delete:
 *    delete:
 *      summary: delete good.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: goodId
 *          type: string
 *          description: delete good.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /goods/:goodId:
 *    get:
 *      summary: get good by Id.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /houses:
 *    get:
 *      summary: get houses.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /house/add:
 *    put:
 *      summary: Add House.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: address
 *          type: string
 *          description: house Address.
 *        - in: formData
 *          name: buildingType
 *          type: string
 *          description: building Type.
 *        - in: formData
 *          name: description
 *          type: string
 *          description: house description.
 *        - in: formData
 *          name: ownerName
 *          type: string
 *          description: house owner Name.
 *        - in: formData
 *          name: ownerPhonenumber
 *          type: number
 *          description: house owner Phonenumber.
 *        - in: formData
 *          name: ownerEmail
 *          type: string
 *          description: house owner Email.
 *        - in: formData
 *          name: agentName
 *          type: string
 *          description: house agent Name.
 *        - in: formData
 *          name: agentPhonenumber
 *          type: number
 *          description: house agent Phonenumber.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /houses/:houseId/delete:
 *    delete:
 *      summary: delete particular house.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */
/**
 * @swagger
 *  paths:
 *  /property/ads:
 *    get:
 *      summary: get all property ads.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /property/ads/:propertyAdId:
 *    get:
 *      summary: get property ads by Id.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */
/**
 * @swagger
 *  paths:
 *  /properties/:propertyId:
 *    get:
 *      summary: get property by Id.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /property/ads/create:
 *    post:
 *      summary: Create Propery Ads.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: location
 *          type: string
 *          description: property location.
 *        - in: formData
 *          name: title
 *          type: string
 *          description: property title.
 *        - in: formData
 *          name: category
 *          type: string
 *          description: property category.
 *        - in: formData
 *          name: description
 *          type: string
 *          adDescription: property description.
 *        - in: formData
 *          name: price
 *          type: string
 *          description: property price.
 *        - in: formData
 *          name: furnishedStatus
 *          type: string
 *          description: property funished Status i.e Semi-Furnished.
 *        - in: formData
 *          name: parkingSpace
 *          type: string
 *          description: property parking Space i.e 4 cars.
 *        - in: formData
 *          name: bedroom
 *          type: number
 *          description: property number of bedrooms.
 *        - in: formData
 *          name: bathroom
 *          type: nuumber
 *          description: property number of bathrooms.
 *        - in: formData
 *          name: image
 *          type: file
 *          description: food image..
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /bills/create:
 *    post:
 *      summary: Create new bill.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: type
 *          type: string
 *          description: new bill type.
 *        - in: formData
 *          name: amount
 *          type: string
 *          description: new bill amount.
 *        - in: formData
 *          name: date
 *          type: date
 *          description: new bill due date.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /bills?type="":
 *    get:
 *      summary: get bill.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /bills/payment:
 *    get:
 *      summary: get bill payment.
 *      consumes:
 *        - application/x-www-form-urlencoded 
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /bills/payment/:paymentId:
 *    get:
 *      summary: get particular bill payment.
 *      consumes:
 *        - application/x-www-form-urlencoded 
 *      responses:
 *        200:
 *          description: OK
 */

 
/**
 * @swagger
 *  paths:
 *  /bills/:billId/update:
 *    put:
 *      summary: update bill.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: prevAmount
 *          type: string
 *          description: previous bill amount.
 *        - in: formData
 *          name: newAmount
 *          type: string
 *          description: new bill amount.  .
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /estate/wallet/balance:
 *    get:
 *      summary: get estate wallet balance.
 *      consumes:
 *        - application/x-www-form-urlencoded 
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /estate/wallet/transaction:
 *    get:
 *      summary: get estate wallet transaction.
 *      consumes:
 *        - application/x-www-form-urlencoded 
 *      responses:
 *        200:
 *          description: OK
 */
/**
 * @swagger
 *  paths:
 *  /estate/wallet/transaction/:transactionId:
 *    get:
 *      summary: get estate wallet transaction.
 *      consumes:
 *        - application/x-www-form-urlencoded 
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /banks:
 *    get:
 *      summary: get list of banks.
 *      consumes:
 *        - application/x-www-form-urlencoded 
 *      responses:
 *        200:
 *          description: OK
 */
  
 
/**
 * @swagger
 *  paths:
 *  /transaction/account/verify:
 *    post:
 *      summary: verify account.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: accountNumber
 *          type: string
 *          description: accountNumber.
 *        - in: formData
 *          name: bankCode
 *          type: string
 *          description: bankCode.
 *      responses:
 *        200:
 *          description: OK
 */

 
/**
 * @swagger
 *  paths:
 *  /transaction/account/transfer:
 *    post:
 *      summary: Transfer Funds.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: accountNumber
 *          type: string
 *          description: accountNumber.
 *        - in: formData
 *          name: bankCode
 *          type: string
 *          description: bankCode.
 *        - in: formData
 *          name: amount
 *          type: string
 *          description: amount.
 *        - in: formData
 *          name: description
 *          type: string
 *          description: description.
 *        - in: formData
 *          name: password
 *          type: string
 *          description: password.
 *      responses:
 *        200:
 *          description: OK
 */




 