import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const namespace = "axios-tracker";
export interface RequestTracker {
    request: AxiosRequestConfig;
    startTime: number;
    id: string;
}

export interface ResponseTracker {
    response: AxiosResponse;
    endTime: number;
    id: string;
}

export const requestTracker: RequestTracker[] = [];
const responseTracker: ResponseTracker[] = [];

export const axiosTracker = (axios: AxiosInstance, callbackFn: (data: any) => void) => {
    axios.interceptors.request.use((config) => {
        if (config[namespace]?.track) {
            const currentState = getCurrentState(config);
            currentState.startTime = Date.now();
            currentState.id = Date.now().toString();
            requestTracker.push({
                request: config,
                startTime: currentState.startTime,
                id: currentState.id
            });
        }
        return config;
    });


    axios.interceptors.response.use((response) => {
        if (response.config[namespace]?.track) {
            const currentState = getCurrentState(response.config);
            currentState.endTime = Date.now();
            responseTracker.push({
                response,
                endTime: currentState.endTime,
                id: currentState.id
            });
            const request = requestTracker.find((tracker) => tracker.id === currentState.id);
            if (request) {
                callbackFn({request, response});
            }
        }
        return response;
    }, (error) => {
        if (error.config[namespace]?.track) {
            const currentState = getCurrentState(error.config);
            currentState.endTime = Date.now();
            responseTracker.push({
                response: error.response,
                endTime: currentState.endTime,
                id: currentState.id
            });

            const request = requestTracker.find((tracker) => tracker.id === currentState.id);
            if (request) {
                callbackFn({request, response: error.response});
            }
        }
        return Promise.reject(error);
    });

    return axios;
};

const getCurrentState = (config: AxiosRequestConfig) => {
    let currentState: any = config[namespace] || {};
    currentState = currentState || {};
    config[namespace] = currentState;
    return currentState;
};

declare module "axios" {
    interface AxiosRequestConfig {
        [namespace]?: {
            track?: boolean;
        };
    }
}
export default axiosTracker;