import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";


const namespace = "axios-tracker";
interface RequestTracker {
    request: AxiosRequestConfig;
    startTime: number;
}

interface ResponseTracker {
    response: AxiosResponse;
    endTime: number;
}

const requestTracker: RequestTracker[] = [];
const responseTracker: ResponseTracker[] = [];

const axiosTracker = (axios: AxiosInstance, callbackFn: (data: any) => void) => {
    axios.interceptors.request.use((config) => {
        if (config[namespace]?.track) {
            const currentState = getCurrentState(config);
            currentState.startTime = Date.now();
            console.log();
            requestTracker.push({
                request: config,
                startTime: currentState.startTime
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
                endTime: currentState.endTime
            });
        }
        return response;
    }, (error) => {
        if (error.config[namespace]?.track) {
            const currentState = getCurrentState(error.config);
            currentState.endTime = Date.now();
            responseTracker.push({
                response: error.response,
                endTime: currentState.endTime,
            });

            callbackFn({
                request: error.config,
                response: error.response,
                startTime: currentState.startTime,
                endTime: currentState.endTime,
            })

        }
        return Promise.reject(error);
    });

    return axios;
}



const getCurrentState = (config: AxiosRequestConfig) => {
    let currentState: any = config[namespace] || {};
    currentState = currentState || {};
    config[namespace] = currentState;
    return currentState;
}

declare module "axios" {
    interface AxiosRequestConfig {
        [namespace]?: {
            track?: boolean;
        }
    }
}
export default axiosTracker;