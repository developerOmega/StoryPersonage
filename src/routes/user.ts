import { Router, Request, Response } from 'express';
import { authToken, authAdmin } from '../middlewares/auth_token';
import MySQL from '../mysql/mysql';
import bcrypt = require('bcrypt');

const router = Router();

router.get( '/users', authToken, ( req: Request, res: Response ) => {
    
    const query =`
        SELECT  id, name, email, type, status, updated_at, created_at FROM users
    `
    MySQL.getQuery( query, ( err: any, users: Object[] ) => {
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(users.length == 0){
            return res.status(404).json({
                ok:false,
                err: {
                    message: "No hay existencia de usuarios"
                }
            })
        }

        return res.json({
            ok: true,
            users
        })

        
    } );

} );

router.get('/users/:id', authToken, (req: Request, res: Response) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);

    const query = `
        SELECT  id, name, email, type, status, updated_at, created_at FROM users WHERE id = ${escapedId}
    `;

    MySQL.getQuery( query, (err: any, user: Object[]) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if( !user ){
            return res.status(404).json({
                ok: false,
                err: {
                    message: "No se pudo encontrar el usuario"
                }
            })
        }

        return res.json({
            ok: true,
            user: user[0]
        })
    } )
});

router.post( '/users', [authToken, authAdmin], (req: Request, res: Response) => {
    let body = req.body;

    let post = {
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        type: body.type,
    }

    let query = `
        INSERT INTO users SET ?
    `;

    MySQL.postQuery( query, post, (err: any, data: any) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        let query = `
            SELECT  id, name, email, type, status, updated_at, created_at FROM users WHERE id = ${ data.insertId }
        `;

        MySQL.getQuery(  query, (err: any, user: Object[]) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                user: user[0] 
            });
        } );

    } );
} );

router.put('/users/:id', [authToken, authAdmin], ( req: Request, res: Response ) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);
    let body = req.body;

    let query = `
        UPDATE users SET ? WHERE id = ${escapedId}
    `;

    MySQL.updateQuery( query,body, ( err: any, user: Object ) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        let query = `
            SELECT  id, name, email, type, status, updated_at, created_at FROM users WHERE id = ${ escapedId }
        `;

        MySQL.getQuery(  query, (err: any, user: Object[]) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                user: user[0]
            });
        } );

        
    } );

});

router.delete('/users/:id', [authToken, authAdmin], (req: Request, res: Response) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);

    const query = `
        DELETE FROM users WHERE id = ${escapedId}
    `;
    
    MySQL.deleteQuery( query, (err: any) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            message: 'el usuario fue eliminado con exito'
        });
    } );
});

router.get('/users/:id/personages', authToken ,(req: Request, res: Response) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id); 

    const query = `
        SELECT personages.id, personages.name, personages.features, personages.age, personages.height, personages.origin 
        FROM personages INNER JOIN users ON personages.user_id=users.id
        WHERE user_id = ${escapedId};
    `;

    MySQL.getQuery(query, (err: any, personages: Object[]) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(personages.length === 0){
            return res.status(404).json({
                ok: false,
                err: {
                    message: "No se encontro el registro"
                }
            });
        }

        return res.json({
            ok: true,
            personages
        });
    })
});

router.get('/users/:id/stories', authToken, (req: Request, res: Response) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);

    const query = `
        SELECT stories.id, stories.title, stories.plot, stories.report
        FROM stories INNER JOIN users ON stories.user_id=users.id
        WHERE user_id = ${ escapedId };
    `;

    MySQL.getQuery(query, (err: any, stories: Object[]) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if(stories.length === 0){
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: "El resgitro no existe"
                    }
                })
            }

            return res.json({
                ok: true,
                stories
            });
    });
});

let routerUser = router;
export default routerUser ;