import express from 'express';
import { Customer } from '../models/models';

const router = express.Router();

router.get('/:id/', async (req, res) => {
    const id = req.params.id;

    // first validate customerId
    const customer = await Customer.where({ id }).fetch({ withRelated: ['documentType'], require: false });
    if (customer === null) { // bookshelf returns null if record does not exists
        res.status(400).send({
            error: 'id does not exists'
        });
    }

    res.send(customer);

    // using bookshelf model to show how it works
    res.send({
        customer_id: customer.id,
        name: customer.get('first_name') + ' ' + customer.get('last_name'),
        document_type: customer.related('documentType').get('name'),
        document_id: customer.get('document_id')
    });
});

export default router;