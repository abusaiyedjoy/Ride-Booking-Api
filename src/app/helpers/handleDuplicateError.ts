import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const duplicateKey = Object.keys(err.keyValue || {})[0];
  const duplicateValue = err.keyValue?.[duplicateKey];

  const message = duplicateKey
    ? `${duplicateKey} "${duplicateValue}" already exists`
    : "Duplicate field value entered.";

  return {
    statusCode: 400,
    success: false,
    message,
  };
};
