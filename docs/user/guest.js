/**
 * @swagger
 * /guest/passes:
 *   get:
 *     description: get all passes generated by a user!
 *     responses:
 *       200:
 *         description: Returns all passes generated by a user.
 */

/**
 * @swagger
 * /guest/passes/:passId/send:
 *   get:
 *     description: send pass generated by user to security!
 *     responses:
 *       200:
 *         description: send pass generated by user to security.
 */

/**
 * @swagger
 * /guest/:guestId/delete:
 *   delete:
 *     description: Delete Guest!
 *     responses:
 *       200:
 *         description: Delete Guest.
 */

/**
 * @swagger
 *  paths:
 *  /guest/passes/:passId/sms/send:
 *    post:
 *      summary: send pass generated by user to guest by sms!
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: phone
 *          type: number
 *          description: A guest phone number.
 *      responses:
 *        200:
 *          description: Returns message status
 */

/**
 * @swagger
 *  paths:
 *  /guest/passes/:passId/email/send:
 *    post:
 *      summary: send pass generated by user to guest by email!
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: string
 *          type: number
 *          description: A guest email.
 *      responses:
 *        200:
 *          description: Returns message status
 */

/**
 * @swagger
 * /guest/guests?page=1&pageSize=4:
 *   get:
 *     description: get all guest created by a user!
 *     responses:
 *       200:
 *         description: Returns all guest created by a user.
 */

/**
 * @swagger
 *  paths:
 *  /guest/create/taxi:
 *    post:
 *      summary: generate pass for a taxi.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: name
 *          type: string
 *          description: new guest name.
 *        - in: formData
 *          name: phone
 *          type: number
 *          description: A new resident phone number.
 *        - in: formData
 *          name: companyName
 *          type: string
 *          description: A new guest company Name.
 *        - in: formData
 *          name: email
 *          type: string
 *          description: A new guest email (Optional).
 *        - in: formData
 *          name: plateNumber
 *          type: string
 *          description: A new guest plate Number.
 *        - in: formData
 *          name: numberOfGuests
 *          type: number
 *          description: number of guests.
 *        - in: formData
 *          name: duration
 *          type: number
 *          description: duration of guests.
 *      responses:
 *        200:
 *          description: Returns generated passes
 */

/**
 * @swagger
 *  paths:
 *  /guest/create/rider:
 *    post:
 *      summary: generate pass for a rider.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: name
 *          type: string
 *          description: new guest name.
 *        - in: formData
 *          name: phone
 *          type: number
 *          description: A new resident phone number.
 *        - in: formData
 *          name: companyName
 *          type: string
 *          description: A new guest company Name.
 *        - in: formData
 *          name: plateNumber
 *          type: string
 *          description: A new guest plate Number.
 *        - in: formData
 *          name: numberOfGuests
 *          type: number
 *          description: number of guests.
 *        - in: formData
 *          name: duration
 *          type: number
 *          description: duration of guests.
 *      responses:
 *        200:
 *          description: Returns generated passes
 */
/**
 * @swagger
 *  paths:
 *  /guest/create/guest:
 *    post:
 *      summary: generate pass for a guest.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: name
 *          type: string
 *          description: new guest name.
 *        - in: formData
 *          name: phone
 *          type: number
 *          description: A new resident phone number.
 *        - in: formData
 *          name: plateNumber
 *          type: string
 *          description: A new guest plate Number.
 *        - in: formData
 *          name: numberOfGuests
 *          type: number
 *          description: number of guests.
 *        - in: formData
 *          name: duration
 *          type: number
 *          description: duration of guests.
 *      responses:
 *        200:
 *          description: Returns generated passes
 */
/**
 * @swagger
 *  paths:
 *  /guest/create/event:
 *    post:
 *      summary: generate pass for a event.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: name
 *          type: string
 *          description: new guest name.
 *        - in: formData
 *          name: phone
 *          type: number
 *          description: A new resident phone number.
 *        - in: formData
 *          name: plateNumber
 *          type: string
 *          description: A new guest plate Number.
 *        - in: formData
 *          name: numberOfGuests
 *          type: number
 *          description: number of guests.
 *        - in: formData
 *          name: duration
 *          type: number
 *          description: duration of guests.
 *      responses:
 *        200:
 *          description: Returns generated passes
 */
