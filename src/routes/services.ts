import express from 'express';
import { Customer } from '../models/models';
import { bookshelf } from '../middlewares/db';

const router = express.Router();

router.get('/:customerId/', async (req, res) => {
    const customerId = req.params.customerId;

    // first validate customerId
    const customer = await Customer.where({ id: customerId }).fetch({ require: false });
    if (customer === null) { // bookshelf returns null if record does not exists
        res.status(400).send({
            error: 'customerId does not exists'
        });
    }

    // retrieve data
    const services = await bookshelf.knex
        .select('item_service.item_id as id', 'item.name', 'customer_item_services.start_date as start', 'customer_item_services.end_date as end', 'item_service_status.name as status').from('customer_item_services')
        .join('item', { 'customer_item_services.item_service_id': 'item.id' })
        .join('item_service_status', { 'customer_item_services.status': 'item_service_status.id' })
        .join('item_service', { 'customer_item_services.item_service_id': 'item_service.item_id' })
        .where({ customer_id: customerId });

    res.send({
        customer_id: customerId,
        services
    });
});

router.get('/:customerId/service/:id', async (req, res) => {
    const customerId = req.params.customerId;
    const id = req.params.id;

    // first validate customerId
    const customer = await Customer.where({ id: customerId }).fetch({ require: false });
    if (customer === null) { // bookshelf returns null if record does not exists
        res.status(400).send({
            error: 'customerId does not exists'
        });
    }

    // retrieve data
    const service = await bookshelf.knex
        .select('item_service.item_id as id', 'item.name', 'customer_item_services.start_date as start', 'customer_item_services.end_date as end', 'item_service_status.name as status').from('customer_item_services')
        .join('item', { 'customer_item_services.item_service_id': 'item.id' })
        .join('item_service_status', { 'customer_item_services.status': 'item_service_status.id' })
        .join('item_service', { 'customer_item_services.item_service_id': 'item_service.item_id' })
        .where({ customer_id: customerId, item_service_id: id }).first();

    if (service === undefined) { // knex returjs undefined if record does not exists
        res.status(400).send({
            error: 'serviceId does not exists for given customerId'
        });
    }

    res.send({
        customer_id: customerId,
        service
    });
});

export default router;