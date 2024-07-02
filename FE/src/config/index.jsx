import routes from './routes';
import roles from './roles'
const HOST =  "http://localhost:7070";
const API_HOST =  `${HOST}/api/v1`;
const JWT_KEY = "jwt_token";
const API_IMAGE_HOST =  `${HOST}/api/v1/image`;
const VAT_FEE_PERCENT = 10;
const VAT_FEE_VALUE = 0.1;

const config = {
    routes,
    HOST,
    API_HOST,
    roles,
    JWT_KEY,
    API_IMAGE_HOST,
    VAT_FEE_PERCENT,
    VAT_FEE_VALUE,
};

export default config;