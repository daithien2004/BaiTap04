import dotenv from 'dotenv';
dotenv.config();
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const saltRounds = 10;

const createUserService = async (name, email, password) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      console.log(`>>> user exist, chọn 1 email khác: ${email}`);
      return null;
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // tạo user mới
    let result = await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: 'User',
    });

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const loginService = async (email, password) => {
  try {
    // tìm user theo email
    const user = await User.findOne({ email });
    if (user) {
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: 'Email/Password không hợp lệ',
        };
      } else {
        const payload = {
          _id: user._id,
          email: user.email,
          name: user.name,
        };

        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        return {
          EC: 0,
          access_token,
          user: {
            email: user.email,
            name: user.name,
          },
        };
      }
    } else {
      return {
        EC: 1,
        EM: 'Email/Password không hợp lệ',
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserService = async () => {
  try {
    let result = await User.find({}).select('-password');
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { createUserService, loginService, getUserService };

// Forgot/Reset Password Services
const requestPasswordResetService = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { EC: 1, EM: 'Email không tồn tại' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    // In production, send token via email. Here we return it for simplicity.
    return { EC: 0, EM: 'OK', token, expiresAt: expires };
  } catch (error) {
    console.log(error);
    return { EC: -1, EM: 'Server error' };
  }
};

const resetPasswordService = async (token, newPassword) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return { EC: 1, EM: 'Token không hợp lệ hoặc đã hết hạn' };
    }

    const hashPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { EC: 0, EM: 'Đổi mật khẩu thành công' };
  } catch (error) {
    console.log(error);
    return { EC: -1, EM: 'Server error' };
  }
};

export { requestPasswordResetService, resetPasswordService };
