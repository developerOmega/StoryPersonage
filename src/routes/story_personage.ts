import { Request, Response, Router } from 'express';
import { authToken } from '../middlewares/auth_token';
import { authStoryPersonage } from '../middlewares/auth_elements';
import MySQL from '../mysql/mysql';

const router = Router();

router.post('/story-personages', [authToken, authStoryPersonage], (req: Request, res: Response) => {
    let body = req.body;
    let post = {
        story_id: body.story_id,
        personage_id: body.personage_id
    }

    let query = `
        INSERT INTO story_personages SET ?
    `;

    MySQL.postQuery(query, post, (err: any, data: any) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        let query = `
            SELECT * FROM story_personages WHERE story_id = ${post.story_id} AND personage_id = ${post.personage_id} 
        `;

        MySQL.getQuery(query, (err: any, story_personage: Object[]) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                }); 
            }

            return res.json({
                ok: true,
                story_personage: story_personage[0] 
            });
        });
    });
});

router.delete('/story-personages', [authToken, authStoryPersonage], (req: Request, res: Response) => {
    let storyId = req.query.story_id;
    let personageId = req.query.personage_id;

    let escapedStoryId = MySQL.instance.connection.escape(storyId);
    let escapedPersonageId = MySQL.instance.connection.escape(personageId);

    const query = `
        DELETE FROM story_personages  WHERE story_id = ${escapedStoryId} AND personage_id = ${escapedPersonageId}
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
            message: "El story_personages fue elimiando con exito",
        })
    })
});

let routerStoryPersonage = router;
export default routerStoryPersonage;