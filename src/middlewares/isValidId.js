import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = () => (req, res, next) => {
  const id = req.params.contactId;

  isValidObjectId(id)
    ? next()
    : next(createHttpError(400, `Id ${id} is not valid`));
};
