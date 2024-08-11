import dotenv from 'dotenv'; // Import dotenv to load environment variables
// Load environment variables from a .env file
dotenv.config();
// Define a Config interface for type safety
interface Config {
    port: number; // Port number for the application
    mongoUri: string; // MongoDB connection URI
    jwtSecretToken: string; // Secret key for JSON Web Tokens
}
// Create a config object based on environment variables
const config: Config = {
    port: parseInt(process.env.PORT || '9000', 10), // Get the port from environment variables or default to 9000
    mongoUri: process.env.MONGO_URI || '', // Get MongoDB URI from environment variables
    jwtSecretToken: process.env.JWT_SECTRET || '' // Get JWT secret from environment variables
}
// Check if MongoDB URI is defined, throw an error if not
if(!config.mongoUri) {
    throw new Error('MONGO_URI is not defined in the environment variables');
}

export default config; // Export the config object for use in other parts of the application
