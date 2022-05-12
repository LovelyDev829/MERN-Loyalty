// or get from process.env.REACT_APP_{var} to handle PROD and DEV environments
let API_URL = 'http://localhost:5000';
if (process.env.NODE_ENV === 'production') {
  API_URL = 'http://3.134.247.219:5000';
} else {
  API_URL = 'http://localhost:5000';
}

export const APP_VERSION = '2.0.0';

export const API_BASE_URL = `${API_URL}/api`;
export const ENABLE_REDUX_LOGGER = false;

export default {};
