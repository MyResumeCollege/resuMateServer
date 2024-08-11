import express from 'express';
import authController from '../controllers/auth.controller';
import passwordResetController from '../controllers/passwordReset.controller';

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/register', authController.registerUser);
router.post('/google', authController.logInGoogle);

router.post('/forgot-password', passwordResetController.generateResetToken);
router.get('/reset-password/:token', passwordResetController.verifyResetToken);
router.post('/reset-password/:token', passwordResetController.resetPassword);

export default router;
