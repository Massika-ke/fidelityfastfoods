import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next)=>{
    // extract token from request headers
    const {token} = req.headers;
    if (!token) {
        return res.json({
            success:false, 
            message:"Not Authorized, Login Again"
        })
    }
    try {
        // verify token with the secret key
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next(); // pass to the Route
    } catch (error) {
        console.log(error);
        res.json({
            success:false, 
            message:" Error"
        })
        
    }

}



export default authMiddleware;