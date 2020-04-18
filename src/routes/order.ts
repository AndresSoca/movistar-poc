import express from 'express';
import { Customer, Order } from '../models/models';
import { bookshelf } from '../middlewares/db';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const code = req.params.id;

    // first validate id
    const order = await Order.where({ code }).fetch({ require: false });
    if (order === null) { // bookshelf returns null if record does not exists
        res.status(400).send({
            error: 'id does not exists'
        });
    }

    // retrieve data
    const tracking = await bookshelf.knex
        .select('status.name as status', 'order_status.created_at as timestamp').from('order_status')
        .join('status', { 'order_status.status_id': 'status.id' })
        .where({ order_code: code });

    res.send({
        order: order.get('code'),
        eta: order.get('eta'),
        tracking
    });
});

export default router;