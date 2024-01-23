// src/authMiddleware.js
const cookieParser = require('cookie-parser');
const jwt =  require('jsonwebtoken');

function authMiddleware(config) {
  const { secret } = config;

  return (req, res, next) => {
    // Use cookie-parser middleware to parse cookies
    cookieParser()(req, res, () => {
      try {
          
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
          console.log(accessToken);
    
          if (!accessToken) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
          const decodedInfo = jwt.verify(accessToken,secret);
          console.log(decodedInfo)
          if(!decodedInfo){
            console.log("Ops! Error occured");
            req
            .status(401)
            .json({message: "Forbidden"})
          }
          req.auth = decodedInfo;
          next();
          
     
      } catch (error) {
        return res.status(401).json({error})
      }

      // Authentication passed
     
    });
  };
}

module.exports = authMiddleware;
  