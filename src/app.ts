import express, { Request, Response } from 'express'; // Importing necessary modules from express
import userRouter from './router/user-router'; // Importing user router from the local router file
import config from './config/config'; // Importing configuration settings
import ConnectDataBase from './libs/connection'; // Importing database connection function
import cors from 'cors'; // Importing CORS middleware for handling cross-origin requests

const app = express(); // Creating an instance of an Express application
const PORT = config.port || 9000; // Setting the port from configuration or defaulting to 9000

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to enable CORS (Cross-Origin Resource Sharing)
app.use(cors());
// Route handler for the root URL
app.get('/', (req: Request,res: Response) => {
    res.send('app is working...')
});
// Registering the user router to handle routes starting with '/user'
app.use('/user',  userRouter)
// Starting the server and listening on the specified port
app.listen(PORT, ()=> {
    console.log(`App is working on PORT ${PORT}`);
    ConnectDataBase();
})
