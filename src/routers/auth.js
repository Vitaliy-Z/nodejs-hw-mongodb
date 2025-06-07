import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
  requestResetPasswordController,
  resetPasswordController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserShema,
  loginUserShema,
  requestResetPasswordUserShema,
  resetPasswordUserShema,
} from '../validation/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserShema),
  ctrlWrapper(registerController),
);

authRouter.post(
  '/login',
  validateBody(loginUserShema),
  ctrlWrapper(loginController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));
authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetPasswordUserShema),
  ctrlWrapper(requestResetPasswordController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordUserShema),
  ctrlWrapper(resetPasswordController),
);

export default authRouter;
