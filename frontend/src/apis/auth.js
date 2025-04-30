import api from './index';

/**
 * Logs in a user with the provided email and password.
 *
 * @param {string} username - The user name of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<any>} A promise that resolves to the response data containing authentication tokens or user details.
 */
export const login = async (username, password) => {
    const response = await api.post('/login', { username, password });
    return response.data;
};

/**
 * Registers a new user with the given email, username, and password.
 *
 * @param {string} email - The email address for the new user.
 * @param {string} username - The username for the new user.
 * @param {string} password - The password for the new user.
 * @returns {Promise<any>} A promise that resolves to the response data confirming the registration.
 */
export const signup = async (email, username, password) => {
    const response = await api.post('/signup', { email, username, password });
    return response.data;
};
