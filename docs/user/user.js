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
 * /info:
 *   get:
 *     description: current user info!
 *     responses:
 *       200:
 *         description: Returns current user details.
 */

/**
 * @swagger
 * /estate?name="":
 *   get:
 *     description: find particular estate with query string!
 *     responses:
 *       200:
 *         description: Returns found estates.
 */

/**
 * @swagger
 *  /estate:
 *    post:
 *      summary: Create new Estate.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: name
 *          type: string
 *          description: An estate's name.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 * /estates:
 *   get:
 *     description: find all estates!
 *     responses:
 *       200:
 *         description: Returns found estates.
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
 *        - in: query
 *          name: estateId
 *          required: true
 *          type: string
 *        - in: formData
 *          name: name
 *          type: string
 *          description: new resident name.
 *        - in: formData
 *          name: phone
 *          type: number
 *          description: A new resident phone number.
 *        - in: formData
 *          name: email
 *          type: email
 *          description: A new resident email.
 *        - in: formData
 *          name: password
 *          type: number
 *          description: A new resident password.
 *        - in: formData
 *          name: houseAddress
 *          type: string
 *          description: A new resident house address.
 *        - in: formData
 *          name: houseOwnerType
 *          type: string
 *          description: A new resident house Owner Type.
 *        - in: formData
 *          name: apartmentType
 *          type: string
 *          description: A new resident house Apartment Type.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /login:
 *    post:
 *      summary: A sample survey.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: query
 *          name: estateId
 *          required: true
 *          type: string
 *        - in: formData
 *          name: email
 *          type: email
 *          description: A pre-registered user email .
 *        - in: formData
 *          name: phone
 *          type: phone
 *          description: A pre-registered user phonenumber.
 *        - in: formData
 *          name: password
 *          type: number
 *          description: A pre-registered user password.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 * /topmost/onboard:
 *   post:
 *     description: create the topmost admin!
 *     responses:
 *       200:
 *         description: create the topmost admin.
 */

/**
 * @swagger
 * /travel?mode= on/off:
 *   put:
 *     description: toggle travel mode!
 *     responses:
 *       200:
 *         description: toggles travel mode.
 */

/**
 * @swagger
 * /travel:
 *   get:
 *     description: get travel mode!
 *     responses:
 *       200:
 *         description: get travel mode.
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
 * /user/estates:
 *   get:
 *     description: returns all user estates!
 *     responses:
 *       200:
 *         description: get config json.
 */

/**
 * @swagger
 *  paths:
 *  /user/estates/add:
 *    post:
 *      summary: Register under a new estate.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: query
 *          name: estateId
 *          required: true
 *          type: string
 *        - in: formData
 *          name: address
 *          type: string
 *          description: Add a new house Address .
 *        - in: formData
 *          name: houseOwnerType
 *          type: string
 *          description: New address house Owner Type.
 *        - in: formData
 *          name: apartmentType
 *          type: string
 *          description: New address apartment Type.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /user/estates/change:
 *    post:
 *      summary: login under a new estate.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: query
 *          name: estateId
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 * /election/candidate:
 *   get:
 *     description: get all election candidate!
 *     responses:
 *       200:
 *         description: get all election candidate.
 */

/**
 * @swagger
 *  paths:
 *  /election/candidate/vote:
 *    post:
 *      summary: cast your vote.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: query
 *          name: candidateId
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /business/create:
 *    post:
 *      summary: create business man.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: name
 *          type: string
 *          description: business name.
 *        - in: formData
 *          name: phone
 *          type: string
 *          description: business phone number.
 *        - in: formData
 *          name: email
 *          type: string
 *          description: business email.
 *        - in: formData
 *          name: category
 *          type: string
 *          description: business category.
 *        - in: formData
 *          name: address
 *          type: string
 *          description: business address.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /business/:businessId/address/add:
 *    post:
 *      summary: add business address.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: address1
 *          type: string
 *          description: business address1.
 *        - in: formData
 *          name: address12
 *          type: string
 *          description: business address2.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /business/:businessId/image:
 *    post:
 *      summary: add business image.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: image
 *          type: image
 *          description: business image.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /business/estate/:estateId:
 *    get:
 *      summary: get estate business .
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
 *  /service/create:
 *    post:
 *      summary: apply as a service man.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: name
 *          type: string
 *          description: service name.
 *        - in: formData
 *          name: phone
 *          type: string
 *          description: service phone number.
 *        - in: formData
 *          name: email
 *          type: string
 *          description: service email.
 *        - in: formData
 *          name: category
 *          type: string
 *          description: service category.
 *        - in: formData
 *          name: address
 *          type: string
 *          description: service address.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /service/:serviceId/image:
 *    post:
 *      summary: add service image.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: image
 *          type: image
 *          description: service image.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /service/estate/:estateId:
 *    get:
 *      summary: get estate service .
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */



/**
 * @swagger
 *  paths:
 *  /service/:serviceId:
 *    get:
 *      summary: get service .
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */




/**
 * @swagger
 *  paths:
 *  /service:
 *    get:
 *      summary: get service .
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /food/create:
 *    post:
 *      summary: create food.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: name
 *          type: string
 *          description: food name.
 *        - in: formData
 *          name: description
 *          type: string
 *          description: food description.
 *        - in: formData
 *          name: price
 *          type: string
 *          description: food price.
 *        - in: formData
 *          name: image
 *          type: file
 *          description: food image.
 *      responses:
 *        200:
 *          description: OK
 */
/**
 * @swagger
 *  paths:
 *  /foods:
 *    get:
 *      summary: get food .
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /food/search:
 *    get:
 *      summary: search food.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: query
 *          name: name
 *          type: string
 *          description: food name.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /food/:foodId/favourite/add:
 *    put:
 *      summary: add food to favourite.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /food/:foodId/favourite/remove:
 *    put:
 *      summary: remove food from favourite.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /food/favourites:
 *    get:
 *      summary: get user favourite food under an estate.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /foods/estate/:estateId:
 *    get:
 *      summary: get food under an estate.
 *      consumes:
 *        - application/x-www-form-urlencoded
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
 *  /foods/:foodId/rate:
 *    get:
 *      summary: rate food.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */
/**
 * @swagger
 *  paths:
 *  /good/create:
 *    post:
 *      summary: create good.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: name
 *          type: string
 *          description: good name.
 *        - in: formData
 *          name: description
 *          type: string
 *          description: good description.
 *        - in: formData
 *          name: price
 *          type: string
 *          description: good price.
 *        - in: formData
 *          name: image
 *          type: file
 *          description: good image.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /goods:
 *    get:
 *      summary: get food .
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /good/search:
 *    get:
 *      summary: search good.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: query
 *          name: name
 *          type: string
 *          description: good name.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /good/:goodId/favourite/add:
 *    put:
 *      summary: add good to favourite.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */
/**
 * @swagger
 *  paths:
 *  /good/:goodId/favourite/remove:
 *    put:
 *      summary: remove good from favourite.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /good/favourites:
 *    get:
 *      summary: get user favourite good under an estate.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /goods/estate/:estateId:
 *    get:
 *      summary: get good under an estate.
 *      consumes:
 *        - application/x-www-form-urlencoded
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
 *  /goods/:goodId/rate:
 *    get:
 *      summary: rate good.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /property/create:
 *    post:
 *      summary: create property.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: title
 *          type: string
 *          description: property title.
 *        - in: formData
 *          name: status
 *          type: string
 *          description: property status.
 *        - in: formData
 *          name: description
 *          type: string
 *          description: good description.
 *        - in: formData
 *          name: image
 *          type: file
 *          description: good image.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /properties?page=1&pageSize=4?status=lease:
 *    get:
 *      summary: get properties .
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /property/search:
 *    get:
 *      summary: search property.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: query
 *          name: name
 *          type: string
 *          description: property name.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /property/:propertyId/favourite/add:
 *    put:
 *      summary: add property to favourite.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /property/:propertyId/favourite/remove:
 *    put:
 *      summary: remove property from favourite.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /property/favourites:
 *    get:
 *      summary: get user favourite property under an estate.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /properties/estate/:estateId:
 *    get:
 *      summary: get properties under an estate.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /properties/:propertyId/rate:
 *    get:
 *      summary: rate property.
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
 *  /updates:
 *    get:
 *      summary: returns all resident update under an estate which includes foods, goods, notification etc.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /notice:
 *    get:
 *      summary: returns list particular estate user's notification.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /notice/linking:
 *    get:
 *      summary: returns list particular estate user's notification isRead status.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /notice/:noticeId:
 *    put:
 *      summary: read particular user notification under an estate.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /suggestion/create:
 *    post:
 *      summary: Create new suggestion.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: subject
 *          type: string
 *          description: new suggestion subject.
 *        - in: formData
 *          name: message
 *          type: string
 *          description: new suggestion message.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /bill:
 *    get:
 *      summary: returns list particular estate user's bills.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /bill/linking:
 *    get:
 *      summary: returns list particular estate user's bills linking.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /bill/upcoming:
 *    get:
 *      summary: returns list of particular estate user's Upcoming bills.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /emergency:
 *    put:
 *      summary: activate emergency mode.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/wallet/balance:
 *    get:
 *      summary: returns  particular estate user's Wallet balance.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /transactions:
 *    get:
 *      summary: returns  particular  user's Wallet transaction.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/airtime/provider:
 *    get:
 *      summary: returns list of airtime providers.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/airtime/request:
 *    post:
 *      summary: buy airtime.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: phone
 *          type: string
 *          description: phonenumber.
 *        - in: formData
 *          name: serviceType
 *          type: string
 *          description: amount.
 *        - in: formData
 *          name: plan
 *          type: string
 *          description: plan.
 *        - in: formData
 *          name: pin
 *          type: string
 *          description: pin.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/data/provider:
 *    get:
 *      summary: returns list of data providers.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/data/bundle/:serviceType:
 *    post:
 *      summary: returns list of data bundle.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/data/request:
 *    post:
 *      summary: buy data.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: phone
 *          type: string
 *          description: phonenumber.
 *        - in: formData
 *          name: serviceType
 *          type: string
 *          description: amount.
 *        - in: formData
 *          name: datacode
 *          type: string
 *          description: datacode.
 *        - in: formData
 *          name: pin
 *          type: string
 *          description: pin.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/electricity/provider:
 *    get:
 *      summary: returns list of electricity providers.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/electricity/request:
 *    post:
 *      summary: buy electricity.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: phone
 *          type: string
 *          description: phonenumber.
 *        - in: formData
 *          name: serviceType
 *          type: string
 *          description: serviceType.
 *        - in: formData
 *          name: amount
 *          type: string
 *          description: amount.
 *        - in: formData
 *          name: accountNumber
 *          type: string
 *          description: accountNumber.
 *        - in: formData
 *          name: pin
 *          type: string
 *          description: pin.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/cabletv/provider:
 *    get:
 *      summary: returns list of cabletv providers.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/multichoice/list/:serviceType:
 *    post:
 *      summary: returns list of multichoice.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/multichoice/request:
 *    post:
 *      summary: buy multichoice.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: productCode
 *          type: string
 *          description: productCode.
 *        - in: formData
 *          name: totalAmount
 *          type: string
 *          description: totalAmount.
 *        - in: formData
 *          name: productMonthsPaidFor
 *          type: string
 *          description: productMonthsPaidFor.
 *        - in: formData
 *          name: smartcardNumber
 *          type: string
 *          description: smartcardNumber.
 *        - in: formData
 *          name: serviceType
 *          type: string
 *          description: serviceType.
 *        - in: formData
 *          name: pin
 *          type: string
 *          description: pin.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/epin/provider:
 *    get:
 *      summary: returns list of epin providers.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/epin/bundles/:serviceType:
 *    post:
 *      summary: returns list of epin.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /services/epin/request:
 *    post:
 *      summary: buy epin.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: productCode
 *          type: string
 *          description: productCode.
 *        - in: formData
 *          name: aAmount
 *          type: string
 *          description: amount.
 *        - in: formData
 *          name: numberOfPins
 *          type: string
 *          description: numberOfPins.
 *        - in: formData
 *          name: pinValue
 *          type: string
 *          description: pinValue.
 *        - in: formData
 *          name: serviceType
 *          type: string
 *          description: serviceType.
 *        - in: formData
 *          name: pin
 *          type: string
 *          description: pin.
 *      responses:
 *        200:
 *          description: OK
 */
