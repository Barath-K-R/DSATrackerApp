import express from 'express'
import * as authController from '../controllers/authController.js'

const authRoutes=express.Router();

authRoutes.post('/login',authController.login)
authRoutes.post('/signup',authController.signUp)
authRoutes.post('/logout',authController.logout)
authRoutes.post('/refresh_token',authController.refreshAccessToken)

export default authRoutes;