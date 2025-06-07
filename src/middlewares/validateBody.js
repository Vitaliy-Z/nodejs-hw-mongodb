import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      next(createHttpError(400, 'Request body is missing or empty'));
      return;
    }

    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    next(createHttpError(400, err));
  }
};
