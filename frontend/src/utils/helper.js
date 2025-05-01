import { toast } from 'react-toastify';

export const catchAsync = async (asyncFn, options = { showToast: true }) => {
    try {
        return await asyncFn();
    } catch (error) {
        let errorMessage = "An unknown error occurred.";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        } else if (typeof error === "object" && error !== null) {
            errorMessage = (error).message ?? JSON.stringify(error);
        }

        // Show toast only if `showToast` is true
        if (options.showToast) {
            toast.error(errorMessage);
        } else {
            console.error("API Error:", error);
        }

        return undefined;
    }
};

export const showSuccess = (message) => {
    toast.success(message || "Operation completed successfully");
};

export const showError = (message) => {
    toast.success(message || "Operation failed");
};

export const handelResponse = (response, actions) => {
    if (response.status) {
        showSuccess(response.message);
    } else {
        if (response.code === 400 && !!actions) {
            actions.setErrors(response.data)
            // throw new Error(response.message);
        }
        // else{
        throw new Error(response.message);
        // }
    }
}

export const handelFormData = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
        const value = values[key];
        if (Array.isArray(value)) {  // For arrays
            value.forEach(element => {
                formData.append(`${key}[]`, element);
            });
        } else {
            if (isFile(value)) {
                formData.append(key, value);
            } else {
                formData.append(key, String(value));
            }
        }
    });
    return formData;
}

function isFile(value) {
    return value instanceof File;
}