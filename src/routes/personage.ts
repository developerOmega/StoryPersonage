import { Request, Response, Router, query } from 'express';
import { authToken } from '../middlewares/auth_token';
import { authPersonage } from '../middlewares/auth_elements';
import MySQL from '../mysql/mysql';

let router = Router();

router.get('/personages', authToken, (req: Request, res: Response ) => {
    const query = `
        SELECT * FROM personages
    `;

    MySQL.getQuery( query, (err: any, personages: Object[]) => {
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
                    message: 'No se encontro el regitro'
                }
            });
        }

        return res.json({
            ok: true,
            personages
        });
    } );
});

router.get('/personages/:id', authToken, (req: Request, res: Response) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);

    const query = `
        SELECT * FROM personages WHERE id = ${ escapedId }
    `;

    MySQL.getQuery(query, (err: any, personage: Object[]) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!personage){
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No se encontro el registro'
                }
            });
        }

        return res.json({
            ok: true,
            personage: personage[0]
        })
    })
});

router.post('/personages', authToken, (req: Request, res: Response) => {
    let body = req.body;
    let post = {
        name: body.name,
        features: body.features,
        age: body.age,
        height: body.height,
        origin: body.origin,
        gender: body.gender,
        user_id: req.user.id
    }

    const query = `
        INSERT INTO personages SET ?
    `;

    MySQL.postQuery(query, post, (err: any, data: any) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }


        let query = `
            SELECT * FROM personages WHERE id = ${ data.insertId }
        `;

        MySQL.getQuery(  query, (err: any, personage: Object[]) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                personage: personage[0]
            });
        } );

       
    });
});

router.put('/personages/:id', [authToken, authPersonage], (req: Request, res: Response) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);
    let body = req.body;

    const query = `
        UPDATE personages SET ? WHERE id = ${ escapedId }
    `;

    MySQL.updateQuery(query, body, (err: any, personage: Object) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        let query = `
            SELECT * FROM personages WHERE id = ${ escapedId }
        `;

        MySQL.getQuery(  query, (err: any, personage: Object[]) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                user: personage[0]
            });
        } );

    });

});

router.delete('/personages/:id', [authToken, authPersonage], (req: Request, res: Response) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);

    const query = `
        DELETE FROM personages WHERE id = ${ escapedId }
    `;

    MySQL.deleteQuery(query, (err: any) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            message: 'El personaje fue eliminado con exito'
        });
    });
});

router.get('/personages/:id/stories', authToken, (req: Request, res: Response) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);

    let query = `
        SELECT stories.id, stories.title, stories.plot, stories.report
        FROM stories INNER JOIN story_personages ON stories.id=story_personages.story_id
        INNER JOIN personages ON story_personages.personage_id=personages.id
        WHERE personages.id = ${ escapedId };
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
                    message: "No se encontro el registro"
                }
            });
        }

        return res.json({
            ok: true,
            stories
        });
    });
});

router.get('/personages/:id/user', authToken, ( req: Request, res: Response ) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);

    let query = `
        SELECT * FROM personages WHERE id = ${escapedId}
    `;

    MySQL.getQuery(query, (err: any, personage: any) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!personage[0]){
            return res.status(404).json({
                ok: false,
                err: {
                    message: "No se encontro el registro"
                }
            });
        }

        let query = `
            SELECT id, name, email, type, status, updated_at, created_at FROM users WHERE id = ${personage[0].user_id}
        `; 

        MySQL.getQuery(query, (err: any, user: any) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                user: user[0]
            });

        });


    });
});

let routerPersonage = router;
export default routerPersonage;