# axios-tracker

This package allows you to track all requests and responses made with axios and collect them in one place. It will only gather the information that is useful to you, such as the endpoint, data, status, statusCode, etc.

## Installation

```sh
npm install axios-tracker
```

## Usage
```typescript
import axios from 'axios';
import axiosTracker from 'axios-tracker';

const client = axios.create();

client.interceptors.request.use(config => {
config['axios-tracker'] = { track: true };
return config;
});

const trackedClient = axiosTracker(client, data => {
// data will contain the request, response, start time, and end time
console.log(data)
});

trackedClient
.get('/test')
.then(response => {
// Handle success
})
.catch(error => {
// Handle error
});
```

## API

### `axiosTracker(axios: AxiosInstance, callbackFn: (data: any) => void)`

Takes in an axios instance and a callback function to handle the gathered data.

### `axios.defaults.axios-tracker = { track: true }`

You can also set `axios-tracker` to `true` in `axios.defaults` to track all requests by default.
