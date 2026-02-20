// This file contains a utility function for handling errors in the application. It creates an error object with a specified status code and message, which can then be passed to the next middleware in the Express.js application for centralized error handling.

export const errorHandler = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}