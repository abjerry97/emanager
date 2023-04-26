/**
 * @swagger
 *  paths:
 *  /profile/edit:
 *    put:
 *      summary: edit personal profile.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
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
 *      responses:
 *        200:
 *          description: Returns edited profile
 */

/**
 * @swagger
 *  paths:
 *  /profile/family/create:
 *    post:
 *      summary: create family member!.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: name
 *          type: string
 *          description: new family member  name.
 *        - in: formData
 *          name: phone
 *          type: number
 *          description: A new family member phone number.
 *        - in: formData
 *          name: email
 *          type: email
 *          description: A new family member  email.
 *        - in: formData
 *          name: relationship
 *          type: number
 *          description: A new family member  relationship.
 *        - in: formData
 *          name: password
 *          type: number
 *          description: A new family member  password.
 *        - in: formData
 *          name: from
 *          type: date
 *          description: A new family member from date
 *        - in: formData
 *          name: to
 *          type: date
 *          description: A new family to date.
 *      responses:
 *        200:
 *          description: Returns created family member
 */


/**
 * @swagger
 * /profile/family/:userId:
 *   delete:
 *     description: delete family member!
 *     responses:
 *       200:
 *         description: delete family member.
 */

/**
   * @swagger
   * /profile/family:
   *   get:
   *     description: get all family member!
   *     responses:
   *       200:
   *         description: get all family member.
   */
  