import { isHttpError } from 'http-errors';

export default function errorHandler(err, req, res, next) {
  console.log(' err:', err);

  if (isHttpError(err) === true) {
    res.status(err.status).json({ status: err.status, message: err.message });
  } else {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
    });
  }
}
