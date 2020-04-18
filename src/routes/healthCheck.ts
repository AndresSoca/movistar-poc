import express from 'express';
import { knex } from '../middlewares/db';
import { environment } from '../middlewares/environment';

const router = express.Router();

router.get("/ping", async (req, res) => {
    const database = await knex.raw('select 1 + 1').then(() => "up").catch(() => "down");
    res.send({
        environment,
        database
    });
});

export default router;