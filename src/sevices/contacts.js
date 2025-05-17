import createHttpError from 'http-errors';
import { contactModel } from '../models/constacts.js';

export function findAllContacts() {
  return contactModel.find();
}

export function findContactByID(id) {
  return contactModel.findById(id);
}

export async function createContact(data) {
  const contact = await contactModel.findOne({ phoneNumber: data.phoneNumber });

  if (contact !== null) {
    throw new createHttpError(
      400,
      `Contact with phone ${data.phoneNumber} is exist`,
    );
  }

  return contactModel.create(data);
}

export function updateContact(id, data) {
  return contactModel.findByIdAndUpdate(id, data, { new: true });
}

export function deleteContact(id) {
  return contactModel.findByIdAndDelete(id);
}
