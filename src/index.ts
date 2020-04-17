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

app.get('/purchase/', async (req, res) => {
  const items = await Item.fetchAll({ withRelated: ['type'], debug: true});
  
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
  const products = await bookshelf.knex
    .select('item_product.item_id as id', 'item.name', 'item_product_brand.name as brand', 'item_product_category.name as category', 'item_product_status.name as status').from('customer_item_products')
    .join('item', {'customer_item_products.item_product_id': 'item.id'})
    .join('item_product_status', {'customer_item_products.status': 'item_product_status.id'})
    .join('item_product', {'customer_item_products.item_product_id': 'item_product.item_id'})
    .join('item_product_brand', {'item_product.brand_id': 'item_product_brand.id'})
    .join('item_product_category', {'item_product.category_id': 'item_product_category.id'})
    .where({ customer_id: req.params.customerId });

  res.send({
    customer_id: req.params.customerId,
    products
  });
});

(async () => {
  await assertDatabaseConnection();

  app.listen(PORT, () => {
    console.log("Started at http://localhost:%d", PORT);
  });
})();
