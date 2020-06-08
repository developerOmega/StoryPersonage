import { Request, Response, NextFunction } from 'express';
import { JsonEnv } from '../config/config';
import jwt = require('jsonwebtoken');

const authToken:any = ( req: Request, res: Response, next: NextFunction ) => {
    let token:any = req.get('Authorization');

    jwt.verify( token, JsonEnv.seed, (err: any, decode:any) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decode.user;
        next();
    });
}

const authAdmin:any = ( req: Request, res: Response, next: NextFunction ) => {
    if(req.user.type != 'admin'){
        return res.status(403).json({
            ok: false,
            err: {
                message: "El usuario no posee los permisos necesarios para este contenido"
            }
        });
    }

    next();
}

export {authToken, authAdmin};