import express from 'express';

const PORT = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';

// this is working better than import
const config = require('./knexfile');
const knex = require('Knex')(config[env]);
const bookshelf = require('Bookshelf')(knex);

async function assertDatabaseConnection() {
  return knex.raw('select 1+1 as result')
      .catch((err: any) => {
          console.log('[Fatal] Failed to establish connection to database! Exiting...');
          console.log(err);
          process.exit(1);
      });
}

const app = express();

app.get("/ping", async (req, res) => {
  const database = await knex.raw('select 1 + 1').then(() => "up").catch(() => "down");
  res.send({
    environment: process.env.NODE_ENV,
    database
  });
});

const ItemType = bookshelf.model('Item Type', {
  tableName: 'item_type'
});

const Item = bookshelf.model('Item', {
  tableName: 'item',
  type() {
    return this.hasOne('Item Type', 'id', 'item_type')
  }
});

const Customer = bookshelf.model('Customer', {
  tableName: 'customer',
  documentType() {
    return this.hasOne('Document Type', 'id', 'document_type');
  }
})

const DocumentType = bookshelf.model('Document Type', {
  tableName: 'document'
})

const Order = bookshelf.model('Order', {
  tableName: 'order'
});

app.get('/customer/:id/', async (req, res) => {
  const id = req.params.id;

  // first validate customerId
  const customer = await Customer.where({ id }).fetch({ withRelated: ['documentType'], require: false });
  if (customer === null) { // bookshelf returns null if record does not exists
    res.status(400).send({
      error: 'id does not exists'
    });
  }

  // using bookshelf model to show how it works
  res.send({
    customer_id: customer.id,
    name: customer.get('first_name') + ' ' + customer.get('last_name'),
    document_type: customer.related('documentType').get('name'),
    document_id: customer.get('document_id')
  });
});

app.get('/purchase/', async (req, res) => {
  const items = await Item.fetchAll({ withRelated: ['type'], debug: true});
  
  // using json object to show how it works
  res.send({ items: items.toJSON().map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        type: item.type.name
      };
    })
  });
});

app.get('/products/:customerId/', async (req, res) => {
  const customerId = req.params.customerId;

  // first validate customerId
  const customer = await Customer.where({ id: customerId }).fetch({ require: false });
  if (customer === null) { // bookshelf returns null if record does not exists
    res.status(400).send({
      error: 'customerId does not exists'
    });
  }

  // retrieve data
  const products = await bookshelf.knex
    .select('item_product.item_id as id', 'item.name', 'item_product_brand.name as brand', 'item_product_category.name as category', 'item_product_status.name as status').from('customer_item_products')
    .join('item', {'customer_item_products.item_product_id': 'item.id'})
    .join('item_product_status', {'customer_item_products.status': 'item_product_status.id'})
    .join('item_product', {'customer_item_products.item_product_id': 'item_product.item_id'})
    .join('item_product_brand', {'item_product.brand_id': 'item_product_brand.id'})
    .join('item_product_category', {'item_product.category_id': 'item_product_category.id'})
    .where({ customer_id: customerId });

  res.send({
    customer_id: customerId,
    products
  });
});

app.get('/products/:customerId/product/:id', async (req, res) => {
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
  const product = await bookshelf.knex
    .select('item_product.item_id as id', 'item.name', 'item_product_brand.name as brand', 'item_product_category.name as category', 'item_product_status.name as status', 'order_items.order_code as delivereyOrderId').from('customer_item_products')
    .join('item', {'customer_item_products.item_product_id': 'item.id'})
    .join('item_product_status', {'customer_item_products.status': 'item_product_status.id'})
    .join('item_product', {'customer_item_products.item_product_id': 'item_product.item_id'})
    .join('item_product_brand', {'item_product.brand_id': 'item_product_brand.id'})
    .join('item_product_category', {'item_product.category_id': 'item_product_category.id'})
    .leftJoin('order_items', {'customer_item_products.item_product_id': 'order_items.item_id'})
    .where({ customer_id: customerId, item_product_id: id }).first();

    if (product === undefined) { // knex returjs undefined if record does not exists
      res.status(400).send({
        error: 'productId does not exists for given customerId'
      });
    }

  res.send({
    customer_id: customerId,
    product
  });
});

app.get('/services/:customerId/', async (req, res) => {
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
    .join('item', {'customer_item_services.item_service_id': 'item.id'})
    .join('item_service_status', {'customer_item_services.status': 'item_service_status.id'})
    .join('item_service', {'customer_item_services.item_service_id': 'item_service.item_id'})
    .where({ customer_id: customerId });

  res.send({
    customer_id: customerId,
    services
  });
});

app.get('/services/:customerId/service/:id', async (req, res) => {
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
    .join('item', {'customer_item_services.item_service_id': 'item.id'})
    .join('item_service_status', {'customer_item_services.status': 'item_service_status.id'})
    .join('item_service', {'customer_item_services.item_service_id': 'item_service.item_id'})
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

app.get('/order/:id', async (req, res) => {
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
    .join('status', {'order_status.status_id': 'status.id'})
    .where({ order_code: code });

  res.send({
    order: order.get('code'),
    eta: order.get('eta'),
    tracking
  });
});

(async () => {
  await assertDatabaseConnection();

  app.listen(PORT, () => {
    console.log("Started at http://localhost:%d", PORT);
  });
})();
