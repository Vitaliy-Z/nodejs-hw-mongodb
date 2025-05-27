import createHttpError from 'http-errors';
import { contactModel } from '../db/models/constacts.js';

export const findAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  if (page < 1) {
    page = 1;
  }

  const { contactType, phoneNumber, name, email, isFavourite } = filter;

  const contactQueryModel = contactModel.find();

  contactType && contactQueryModel.where('contactType').equals(contactType);
  phoneNumber &&
    contactQueryModel.where('phoneNumber').regex(new RegExp(phoneNumber, 'i'));
  name && contactQueryModel.where('name').regex(new RegExp(name, 'i'));
  email &&
    contactQueryModel
      .where('email')
      .regex(new RegExp(`${email}(?=[^@]*@)`, 'i'));
  isFavourite !== null &&
    contactQueryModel.where('isFavourite').equals(isFavourite);

  const totalItems = await contactModel.countDocuments(contactQueryModel);
  const totalPages = Math.ceil(totalItems / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = page > 1 ? (page - 1) * perPage : 0;
  const data = await contactQueryModel
    .find()
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(perPage);

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const findContactByID = (id) => {
  return contactModel.findById(id);
};

export const createContact = async (data) => {
  const contact = await contactModel.findOne({ phoneNumber: data.phoneNumber });

  if (contact !== null) {
    throw new createHttpError(
      400,
      `Contact with phone ${data.phoneNumber} is exist`,
    );
  }

  return contactModel.create(data);
};

export const updateContact = (id, data) => {
  return contactModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteContact = (id) => {
  return contactModel.findByIdAndDelete(id);
};
