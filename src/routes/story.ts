import { Request, Response, Router } from 'express';
import { authToken } from '../middlewares/auth_token';
import { authStory } from '../middlewares/auth_elements';
import MySQL from '../mysql/mysql';

const router = Router();

router.get('/stories', authToken, (req: Request, res: Response) => {
    let query = `
        SELECT * FROM stories
    `;

    MySQL.getQuery(query, (err: any, stories: Object[]) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(stories.length === 0){
            return res.json(404).json({
                ok: false,
                err: {
                    message: "No se encontro el registro"
                }
            });
        }

        return res.json({
            ok: true,
            stories
        })
    });

});

router.get('/stories/:id', authToken, (req: Request, res: Response) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);

    let query = `
        SELECT * FROM stories WHERE id = ${escapedId}
    `;

    MySQL.getQuery(query, (err: any, story: Object[]) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!story){
            return res.status(404).json({
                ok: false,
                err: {
                    message: "No se encotro el registro"
                }
            })
        }

        return res.json({
            ok: true,
            story: story[0]
        })
    })
})

router.post('/stories', authToken, (req: Request, res: Response) => {
    let body = req.body;
    let post = {
        title: body.title,
        plot: body.plot,
        type: body.type,
        report: body.report,
        user_id: req.user.id
    } 

    let query = `
        INSERT INTO stories SET ?
    `;

    MySQL.postQuery(query, post, (err: any, data: any) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        let query = `
            SELECT * FROM stories WHERE id = ${data.insertId}
        `;

        MySQL.getQuery(query, (err: any, story: Object[]) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                story: story[0]
            });
        });

    })
});

router.put('/stories/:id', [authToken, authStory], (req: Request, res: Response) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);
    let body = req.body;

    let query = `
        UPDATE stories SET ? WHERE id = ${ escapedId }
    `;

    MySQL.updateQuery(query, body, (err: any, data: any) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        let query = `
            SELECT * FROM stories WHERE id = ${escapedId}
        `;

        MySQL.getQuery(query, (err: any, story: Object[]) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                story: story[0] 
            });

        });
    });
});

router.delete('/stories/:id', [authToken, authStory], (req: Request, res: Response) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);

    const query = `
        DELETE FROM stories WHERE id = ${escapedId}
    `;

    MySQL.deleteQuery(query, (err: any) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            message: "La historia fue eliminada con exito"
        });
    });
});

router.get('/stories/:id/personages', authToken, (req: Request, res: Response) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);

    const query = `
        SELECT personages.id, personages.name, personages.features, personages.age, personages.height, personages.origin
        FROM stories INNER JOIN story_personages ON stories.id=story_personages.story_id
        INNER JOIN personages ON story_personages.personage_id=personages.id
        WHERE stories.id = ${escapedId};
    `;

    MySQL.getQuery(query, (err: any, personages: Object[]) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if( personages.length === 0 ){
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

router.get('/stories/:id/user', authToken, ( req: Request, res: Response ) => {
    let id = req.params.id;
    let escapedId = MySQL.instance.connection.escape(id);

    let query = `
        SELECT * FROM stories WHERE id = ${escapedId}
    `;

    MySQL.getQuery(query ,(err: any, story: any) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!story[0]){
            return res.status(404).json({
                ok: false,
                err: {
                    message: "No se encontro el registro"
                }
            });
        }

        let query = `
            SELECT id, name, email, type, status, updated_at, created_at FROM users WHERE id = ${story[0].user_id}
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


let routerStory = router;
export default routerStory;