import { json, Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllContactsController,
  getContactByIDController,
  createContactController,
  updateContactController,
  removeContact,
} from '../controllers/contacts.js';

const router = Router();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIDController));

router.post('/', json(), ctrlWrapper(createContactController));

router.patch('/:contactId', json(), ctrlWrapper(updateContactController));

router.delete('/:contactId', ctrlWrapper(removeContact));

export default router;
