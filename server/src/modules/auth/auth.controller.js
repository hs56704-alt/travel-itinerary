import asyncHandler from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { registerUser, loginUser } from './auth.service.js';


export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const data = await registerUser({ name, email, password });
  successResponse(res, 'Registration successful', data, 201);
});


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const data = await loginUser({ email, password });
  successResponse(res, 'Login successful', data);
});


export const getMe = asyncHandler(async (req, res) => {
  successResponse(res, 'User fetched', { user: req.user });
});