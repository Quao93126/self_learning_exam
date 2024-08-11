import { Request, Response, NextFunction } from 'express'; // Importing necessary modules from express
import jwt from 'jsonwebtoken'; // Importing jsonwebtoken for token verification
import config from '../config/config'; // Importing configuration settings

// Extending the Request interface to include an optional userId property
interface AuthenticatedRequest extends Request {
    userId?: string;
}

// Middleware function to verify JWT tokens
const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Retrieve the Authorization header from the request
        const token = req.header('Authorization');

        // If no token is provided, respond with a 401 Unauthorized status
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access Denied!'
            });
        }

        // Split the token to get the actual token part (Bearer <token>)
        const tokenPart = token.split(' ')[1];
        
        // Verify the token using the secret key from the config
        const decoded: any = jwt.verify(tokenPart, config.jwtSecretToken);        
        req.userId = decoded.userId; // Attach the decoded userId to the request object
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If the token is invalid or verification fails, respond with a 401 Unauthorized status
        return res.status(401).json({
            success: false,
            message: 'Invalid Token',
        });
    }
};

export default verifyToken;
