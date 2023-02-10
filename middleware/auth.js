import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
  

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userId = decoded.id;
        next()
      } catch (error) {
        res.status(401).json({message: 'Not authorized'})
      }
    } else {
      res.status(401).json({message: 'Not authorized'})
    }

    
}

export default auth