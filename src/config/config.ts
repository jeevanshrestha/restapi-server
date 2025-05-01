import { config as conf } from "dotenv"
import cloudinary from "./cloudinary";
conf();

const _config = {

    port: process.env.PORT,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    cloudinary_cloud_name:process.env.COLUDINARY_CLOUD_NAME,
    cloudinary_api_key:process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret:process.env.CLOUDINARY_API_SECRET,
    coludinary_url:process.env.CLOUDINARY_URL,
}


export const config = Object.freeze(_config) // make config Read only