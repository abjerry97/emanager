/**
 * @swagger
 *  paths:
 *  /login:
 *    post:
 *      summary: add a new resident.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
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
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /pass/check:
 *    post:
 *      summary: check pass.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: pass
 *          type: string
 *          description: A new visitor pass.
 *      responses:
 *        200:
 *          description: OK
 */

/**
 * @swagger
 *  paths:
 *  /pass/:passId/confirm:
 *    post:
 *      summary: confirm pass.
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters:
 *        - in: formData
 *          name: pass
 *          type: string
 *          description: A new visitor pass.
 *      responses:
 *        200:
 *          description: OK
 */
