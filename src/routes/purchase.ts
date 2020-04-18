import express from 'express';
import { Customer, Item } from '../models/models';

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

router.post('/', async (req, res) => {
    const customerId = req.body.customer_id;
    const itemId = req.body.item;

    if (customerId === undefined || itemId === undefined) {
        res.status(400).send({
            error: 'Missing required data'
        });
    }

    // validate customerId
    const customer = await Customer.where({ id: customerId }).fetch({ require: false });
    if (customer === null) { // bookshelf returns null if record does not exists
        res.status(400).send({
            error: 'customerId does not exists'
        });
    }

    // validate item
    const item = await Item.where({ id: itemId }).fetch({ require: false });
    if (item === null) { // bookshelf returns null if record does not exists
        res.status(400).send({
            error: 'item does not exists'
        });
    }

    // add logic here to really insert data into database

    res.status(200).send({
        status: 'Purchase ok. Pending activation'
    });
});

export default router;