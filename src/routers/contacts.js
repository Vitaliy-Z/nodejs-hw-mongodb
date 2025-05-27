import { json, Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllContactsController,
  getContactByIDController,
  createContactController,
  updateContactController,
  removeContact,
} from '../controllers/contacts.js';
import {
  createContactSchema,
  updateContactSchema,
  validateBody,
} from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', isValidId(), ctrlWrapper(getContactByIDController));

router.post(
  '/',
  json(),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:contactId',
  json(),
  isValidId(),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.delete('/:contactId', isValidId(), ctrlWrapper(removeContact));

export default router;
