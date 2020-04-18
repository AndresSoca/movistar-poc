import express from 'express';
import { Item } from '../models/models';

const router = express.Router();

router.get('/', async (req, res) => {
    const items = await Item.fetchAll({ withRelated: ['type'], debug: true });

    // using json object to show how it works
    res.send({
        items: items.toJSON().map((item: any) => {
            return {
                id: item.id,
                name: item.name,
                type: item.type.name
            };
        })
    });
});

export default router;