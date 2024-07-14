import { AppError } from "../utils/classError.js";

export default (roles )=>{
    return (req,res,next)=>{

        if (!roles.includes(req.user.role)  ){
            return next(new AppError('Unauthorized'))
        }
        next()
    }
}