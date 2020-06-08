import { Router, Request, Response } from 'express';
import { JsonEnv } from '../config/config';
import MySQL from '../mysql/mysql';
import jwt = require('jsonwebtoken');
import bcrypt = require('bcrypt');

const router = Router();

router.post('/users/login', (req: Request, res: Response) => {
    let body = req.body;

    let query = `
        SELECT * FROM users WHERE email = "${body.email}"
    `;

    MySQL.getQuery(query, (err: any, user: any[]) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!user[0]){
            return res.status(404).json({
                ok: false,
                err: {
                    message: "Ususario y contrasenia son incorrectos"
                }
            })
        }

        if( !bcrypt.compareSync(body.password, user[0].password) ){
            return res.status(404).json({
                ok: false,
                err: {
                    message: "Usuario y contrasenia son incorrectos"
                }
            })
        }

        delete user[0].password;
        let token = jwt.sign({ user: user[0] }, JsonEnv.seed, {expiresIn: JsonEnv.expiredToken});
        
        return res.json({
            ok: true,
            user: user[0],
            token
        });
    });

    
});

const routerUserAuth = router;
export default routerUserAuth;
