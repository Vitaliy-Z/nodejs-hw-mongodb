import bcrypt from 'bcrypt';
import { sessionModel, userModel } from '../db/models/models.js';
import createHttpError from 'http-errors';
import { createSession } from '../utils/session.js';

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
