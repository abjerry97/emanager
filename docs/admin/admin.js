/**
 * @swagger
 *  paths:
 *  /login:
 *    post:
 *      summary: create family member!.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: email
 *          type: email
 *          description: A admin  email.
 *        - in: formData
 *          name: password
 *          type: number
 *          description: A admin  password.
 *      responses:
 *        200:
 *          description: Returns   admin
 */
 

/**
 * @swagger
 *  paths:
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
 * /estates?page=1&pageSize=4&name="":
 *   get:
 *     description: find all estates!
 *     responses:
 *       200:
 *         description: Returns found estates.
 */

/**
 * @swagger
 *  paths:
 *  /create:
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
 *          description: A new Admin password.
 *        - in: formData
 *          name: excoRole
 *          type: string
 *          description: A new excoRole.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 * /admins:
 *   get:
 *     description: find all admins!
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
 *          description: A new Admin password.
 *        - in: formData
 *          name: excoRole
 *          type: string
 *          description: A new excoRole.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /election/create:
 *    post:
 *      summary: Create new election.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: name
 *          name: name
 *          type: string
 *          description: new election name.
 *        - in: formData
 *          name: role
 *          type: string
 *          description: A new election role.
 *        - in: formData
 *          name: type
 *          type: number
 *          description: A number specifying the election type 0 for exco 1 for others.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 * /election/active:
 *   get:
 *     description: get all active elections!
 *     responses:
 *       200:
 *         description: get all active elections.
 */

/**
 * @swagger
 *  paths:
 *  /election/candidate/create:
 *    post:
 *      summary: Create new election candidate.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: query
 *          name: electionId
 *          required: true
 *          type: string
 *          description: A new election candidate role  which should be sent as electionId in query params it should be a dropdown , all active election role  can be gotten /election/active .
 *        - in: name
 *          name: name
 *          type: string
 *          description: new election candidate name.
 *        - in: formData
 *          name: excoRole
 *          type: string
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 * /election/candidate/active:
 *   get:
 *     description: get all active election candidate!
 *     responses:
 *       200:
 *         description: get all active election candidate.
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
 *  /election/candidate/create:
 *    post:
 *      summary: Create new election candidate.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: query
 *          name: electionId
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /forum/create:
 *    post:
 *      summary: Create new forum.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: message
 *          type: string
 *          description: new forum message.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /bill/create:
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
 *  /bill?type="":
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
 *  /bill/:billId/update:
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
 *  /properties:
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
 *    put:
 *      summary: delete properties.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: properties
 *          type: array
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
 *    put:
 *      summary: delete food.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: foods
 *          type: array
 *          description: delete food.
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
 *    put:
 *      summary: delete good.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: goods
 *          type: array
 *          description: delete good.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /house:
 *    get:
 *      summary: get house.
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
 *  /house/:houseId/delete:
 *    delete:
 *      summary: delete particular house.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      responses:
 *        200:
 *          description: OK
 */
