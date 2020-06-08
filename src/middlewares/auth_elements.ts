import { Request, Response, NextFunction } from 'express';
import MySQL from '../mysql/mysql';

const authPersonage:any = (req: Request, res: Response, next: NextFunction) => {
    let escapedId = MySQL.instance.connection.escape(req.params.id);
    const query = `
        SELECT * FROM personages WHERE id = ${escapedId}
    `;

    MySQL.getQuery( query, (err: any, personage: any) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(personage[0].user_id != req.user.id){
            return res.status(403).json({
                ok: false,
                err: {
                    message: "El personaje no pertenece al usuario"
                }
            })
        }

        next();
    });
}

const authStory:any = (req: Request, res: Response, next: NextFunction) => {
    let escapedId = MySQL.instance.connection.escape(req.params.id);

    const query = `
        SELECT * FROM stories WHERE id = ${escapedId}
    `;

    MySQL.getQuery(query, (err: any, story: any) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(story[0].user_id != req.user.id){
            return res.status(403).json({
                ok: false,
                err: {
                    message: "La historia no pertenece al usuario"
                }
            });
        }

        next();
    });
}

const authStoryPersonage: any = ( req: Request, res: Response, next: NextFunction ) => {
    let body = req.method === 'POST' ? req.body : req.query;
    
    let query = `
        SELECT * FROM personages WHERE id = ${body.personage_id}
    `;

    MySQL.getQuery(query, (err: any, personage: any) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(personage[0].user_id != req.user.id){
            return res.status(403).json({
                ok: false,
                err: {
                    message: "El personage no pertenece al usuario"                    
                }
            })
        }

        let query = `
            SELECT * FROM stories WHERE id = ${body.story_id}
        `;

        MySQL.getQuery(query, (err: any, story: any) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
    
            if(story[0].user_id != req.user.id){
                return res.status(403).json({
                    ok: false,
                    err: {
                        message: "La historia no pertenece al usuario"                    
                    }
                })
            }

            next();
        });
    });
}


export { authPersonage, authStory, authStoryPersonage };