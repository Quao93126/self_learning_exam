import mongoose from 'mongoose'; // Importing mongoose for MongoDB interactions
import config from '../config/config'; // Importing configuration settings

// Function to establish a connection to the MongoDB database
const ConnectDataBase = async() => {
    try {
        // Retrieve the MongoDB URI from the configuration
        const mongoUri = config.mongoUri;

        // Connect to MongoDB using the URI
        await mongoose.connect(mongoUri);

        // Log a success message if the connection is established
        console.log('mongodb is connected successfully!');
        
    } catch (error) {
        // Log an error message if the connection fails
        console.log('error', error);   
    }
}

export default ConnectDataBase;