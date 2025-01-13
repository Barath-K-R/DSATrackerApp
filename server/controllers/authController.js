import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import RefreshTokenModel from '../models/RefreshTokenModel.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const signUp = async (req, res) => {
  const { email, password } = req.body;
  const username=email.split('@')[0]
  console.log(email+' '+username,+' '+password);
  try {

    const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};


export const login = async (req, res) => {
    const { identifier, password } = req.body;
    console.log(req.body);
  
    try {
     
      const user = await UserModel.findOne({
        $or: [
          { username: identifier },
          { email: identifier }
        ]
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
    
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
    
      const accessToken = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_ACCESS_SECRET,
        { expiresIn: '10s' }
      );
  
      
      const refreshToken = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );
  

      const existingRefreshToken = await RefreshTokenModel.findOne({ userId: user._id });
      if (existingRefreshToken) {
        await RefreshTokenModel.updateOne({ userId: user._id }, { refreshToken });
      } else {
        const newRefreshToken = new RefreshTokenModel({ userId: user._id, refreshToken });
        await newRefreshToken.save();
      }
  

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,  
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,  
        path: '/',  
    });
    

    // Send response
    res.status(200).json({
        accessToken,
        user
    });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error logging in', error });
    }
};
 

export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  try {

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const userId = decoded.userId;

    await RefreshTokenModel.deleteOne({ userId });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error });
  }
};

export const refreshAccessToken = async (req, res) => {
  console.log(req.cookies);
  console.log('REFRESHING ACCESS TOKEN');
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    console.log('refresh token not provided');
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  try {

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const userId = decoded.userId;


    const storedToken = await RefreshTokenModel.findOne({ userId, refreshToken });
    if (!storedToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_ACCESS_SECRET,
      { expiresIn: '10s' }
    );

    const newRefreshToken = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    
    await RefreshTokenModel.updateOne(
      { userId },
      { refreshToken: newRefreshToken }
    );

 
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure:false,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.status(200).json({ accessToken, user });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

