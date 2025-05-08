import axios from 'axios';
import { toast } from 'react-hot-toast';
declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        serviceType?: string;
        NFTDataReply?: any[];
        artifactPath?: string;
        metadatPath?: string;
    }
}

// Define API ports for different services
const API_PORTS: any = {
    node: "https://dev-api.xellwallet.com:444/api/",
    dapp: "https://dev-api.xellwallet.com:8443/api/",
    faucet: "https://trie-faucet-api.trie.network"
};

// Create axios instance with default config
const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    async (config: any) => {
        // Determine which port to use based on request URL or custom config property
        // const serviceType = config.serviceType == "daap" ? "daap" : 'node';

        config.baseURL = API_PORTS[config.serviceType];

        if (config.data instanceof FormData) {
            config.headers['accept'] = 'multipart/form-data';
            config.headers["Content-Type"] = 'multipart/form-data';
        }
        return config;
    },
    (error) => {
        // Handle request errors
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Handle successful responses
        return response?.data;
    },
    async (error) => {
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
            // Clear auth state and redirect to login
            return Promise.reject(error);
        }

        // Handle 403 Forbidden errors
        if (error.response?.status === 403) {
            toast.error('You do not have permission to perform this action', { position: 'top-center' });
            return Promise.reject(error);
        }

        // Handle 404 Not Found errors
        if (error.response?.status === 404) {
            toast.error('Resource not found', { position: 'top-center' });
            return Promise.reject(error);
        }

        if (error.response?.status === 504) {
            toast.error('The server is taking too long to respond. Please try again later.', { position: 'top-center' });
            return Promise.reject(error);
        }

        // Handle 422 Validation errors
        if (error.response?.status === 422) {
            const validationErrors = error.response.data?.errors;
            if (validationErrors) {
                Object.values(validationErrors).forEach((error: any) => {
                    toast.error(error[0]);
                });
            }
            return Promise.reject(error);
        }

        // Handle network errors
        if (error.message === 'Network Error') {
            toast.error('Network error.', { position: 'top-center' });
            return Promise.reject(error);
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            toast.error('Request timed out. Please try again.', { position: 'top-center' });
            return Promise.reject(error);
        }

        // // Handle other errors
        // toast.error(
        //     error?.response?.data?.message || 'An unexpected error occurred',
        //     { position: 'top-center' }
        // );

        return Promise.reject(error);
    }
);

export default api;