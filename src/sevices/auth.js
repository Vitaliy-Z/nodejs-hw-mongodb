import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Handlebars from 'handlebars';
import { sessionModel, userModel } from '../db/models/models.js';
import createHttpError from 'http-errors';
import { createSession } from '../utils/session.js';
import { getReserPasswordTemplate } from '../utils/getTemplates.js';
import { sendEmail } from '../utils/emailSendler.js';

export const registerUser = async (data) => {
  const user = await userModel.findOne({ email: data.email });

  if (user !== null) {
    throw new createHttpError(409, 'Email in use!');
  }

  data.password = await bcrypt.hash(data.password, 10);

  return userModel.create(data);
};

export const loginUser = async (data) => {
  const user = await userModel.findOne({ email: data.email });

  if (user === null) {
    throw createHttpError(401, 'Email or password is incorrect!');
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw createHttpError(401, 'Email or password is incorrect!');
  }

  await sessionModel.deleteOne({ userId: user._id });

  return sessionModel.create(createSession(user._id));
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await sessionModel.findOne({ _id: sessionId });

  if (session === null || session.refreshToken !== refreshToken) {
    throw createHttpError(401, 'User is Unauthorized!');
  }
  if (session.refreshTokenValidUntil < Date.now()) {
    throw createHttpError(401, 'Refresh token is expired!');
  }

  await sessionModel.deleteOne({ _id: sessionId });

  return sessionModel.create(createSession(session.userId));
};

export const logoutUser = async (sessionId) => {
  if (!sessionId) {
    throw createHttpError(401, 'User is Unauthorized!');
  }
  await sessionModel.deleteOne({ _id: sessionId });
};

export const requestResetPassword = async (email) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const jwtToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '5m' },
  );

  const emailTemplete = Handlebars.compile(getReserPasswordTemplate());

  try {
    await sendEmail(
      user.email,
      'Reset Password!',
      emailTemplete({
        name: user.name,
        link: `${process.env.APP_DOMAIN}/reset-password?token=${jwtToken}`,
      }),
    );
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
    } else {
      throw err;
    }
  }
};

export const updatePassword = async (password, jwtToken) => {
  let jwtPayload;

  try {
    jwtPayload = jwt.verify(jwtToken, process.env.JWT_SECRET);
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError(401, 'Token is expired or invalid.');
    } else {
      throw err;
    }
  }

  const user = await userModel.findOne({ email: jwtPayload.email });

  if (user === null) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await userModel.findOneAndUpdate(
    { email: user.email },
    { password: hashedPassword },
  );

  await sessionModel.findOneAndDelete({ userId: user._id });

  console.log(' jwtPayload:', jwtPayload);
};
