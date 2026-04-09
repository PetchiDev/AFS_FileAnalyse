import { VALIDATION } from '@/config/constants';

export const validateEmail = (email) => {
  if (!email) return false;
  return VALIDATION.EMAIL_REGEX.test(email);
};

export const validatePassword = (password) => {
  if (!password) return false;
  return (
    password.length >= VALIDATION.MIN_PASSWORD_LENGTH &&
    password.length <= VALIDATION.MAX_PASSWORD_LENGTH
  );
};

export const validatePhone = (phone) => {
  if (!phone) return false;
  return VALIDATION.PHONE_REGEX.test(phone);
};

export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateFileSize = (file, maxSize = 5242880) => {
  if (!file) return false;
  return file.size <= maxSize;
};

export const validateFileType = (file, allowedTypes = []) => {
  if (!file || allowedTypes.length === 0) return false;
  return allowedTypes.includes(file.type);
};

