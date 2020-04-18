import express from 'express';
import { Customer, Item, Product, Purchase, Service, CustomerProducts, CustomerServices } from '../models/models';

const router = express.Router();

router.get('/', async (req, res) => {
    const items = await Item.fetchAll({ withRelated: ['type'] });

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

router.get('/:code/', async (req, res) => {
    const code = req.params.code;

    const purchase = await Purchase.where({ code }).fetch({ withRelated: ['items'], require: false });

    if (purchase === null) { // bookshelf returns null if record does not exists
        res.status(400).send({
            error: 'code does not exists'
        });
    }

    const items: any[] = [];
    await purchase.related('items').forEach(async (item: any) => {
        items.push({
            id: item.id,
            name: item.get('name')
        });
    });

    res.send({
        code: purchase.get('code'),
        items
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
    const code = makeId(7);
    const date = new Date();
    const purchase = new Purchase({ code, customer_id: customerId, description: 'New Purchase', created_at: date });
    purchase.related('items').create(item);

    await purchase.save(null, { method: 'insert' });

    // add to customer
    if (item.get('item_type') === 1) { // product
        const product = await Product.where({ item_id: itemId }).fetch({ require: false }); // this is to make sure item_product exists
        if (product !== null) { // bookshelf returns null if record does not exists
            const customerProduct = new CustomerProducts({ customer_id: customerId, item_product_id: product.get('item_id'), start_date: date, status: 2 }); // status: delivery_pending
            await customerProduct.save(null, { method: 'insert' });
        }
    } else if (item.get('item_type') === 2) { // service
        const service = await Service.where({ item_id: itemId }).fetch({ require: false }); // this is to make sure item_service exists
        if (service !== null) { // bookshelf returns null if record does not exists
            const serviceProduct = new CustomerServices({ customer_id: customerId, item_service_id: service.get('item_id'), start_date: date, status: 2 }); // status: pending
            await serviceProduct.save(null, { method: 'insert' });
        }
    }

    // TODO: If needed, create Order too

    res.status(200).send({
        status: 'Purchase ok. Pending activation',
        code
    });
});

function makeId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default router;