import { body } from "express-validator";

export default [
  body("password")
    .notEmpty()
    .withMessage("Wachtwoord is een verplicht veld.")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Wachtwoord moet minimaal 8 karakters lang zijn."),
];
