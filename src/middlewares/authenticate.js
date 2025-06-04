import createHttpError from 'http-errors';
import { sessionModel, userModel } from '../db/models/models.js';

export const authenticate = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [bearer, accessToken] = req.headers.authorization.split(' ');

  if (bearer !== 'Bearer' || !accessToken) {
    return next(createHttpError(401, 'Incorrect Authorization headerer'));
  }

  const session = await sessionModel.findOne({ accessToken });

  if (!session) {
    return next(createHttpError(401, 'User is unauthorized!'));
  }

  if (session.accessTokenValidUntil <= new Date()) {
    return next(createHttpError(401, 'Access token expired'));
  }

  req.user = await userModel.findOne({ _id: session.userId });

  next();
};
