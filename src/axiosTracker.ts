import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";
const namespace = "axios-tracker";

interface RequestTracker {
    request: AxiosRequestConfig;
    startTime: number;
    id: string;
}
interface ResponseTracker {
    response: AxiosResponse;
    endTime: number;
    id: string;
}

let requestTracker: RequestTracker[] = [];
let responseTracker: ResponseTracker[] = [];

const axiosTracker = (axios: AxiosInstance, callbackFn: (data: any) => void) => {
    axios.interceptors.request.use((config) => {
        if (config[namespace]?.track) {
            const id = uuidv4();
            requestTracker.push({
                request: config,
                startTime: Date.now(),
                id
            });
            config[namespace] = { id, track: true }
        }
        return config;
    });

    axios.interceptors.response.use((response) => {
        if (response.config[namespace]?.track) {
            const { id } = response.config[namespace];
            responseTracker.push({
                response,
                endTime: Date.now(),
                id
            });
            const request = requestTracker.find((tracker) => tracker.id === id);
            if (request) {
                callbackFn({ request, response });
            }
        }
        return response;
    }, (error) => {
        if (error.config[namespace]?.track) {
            const { id } = error.config[namespace];
            responseTracker.push({
                response: error.response,
                endTime: Date.now(),
                id
            });
            const request = requestTracker.find((tracker) => tracker.id === id);
            if (request) {
                callbackFn({ request, response: error.response });
            }
        }
        return Promise.reject(error);
    });
    return axios;
};

declare module "axios" {
    interface AxiosRequestConfig {
        [namespace]?: {
            id: string;
            track?: boolean;
        }
    }
}

export default axiosTracker;
