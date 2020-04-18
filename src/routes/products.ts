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
  const products = await bookshelf.knex
    .select('item_product.item_id as id', 'item.name', 'item_product_brand.name as brand', 'item_product_category.name as category', 'item_product_status.name as status').from('customer_item_products')
    .join('item', { 'customer_item_products.item_product_id': 'item.id' })
    .join('item_product_status', { 'customer_item_products.status': 'item_product_status.id' })
    .join('item_product', { 'customer_item_products.item_product_id': 'item_product.item_id' })
    .join('item_product_brand', { 'item_product.brand_id': 'item_product_brand.id' })
    .join('item_product_category', { 'item_product.category_id': 'item_product_category.id' })
    .where({ customer_id: customerId });

  res.send({
    customer_id: customerId,
    products
  });
});

router.get('/:customerId/product/:id', async (req, res) => {
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
    .join('item', { 'customer_item_products.item_product_id': 'item.id' })
    .join('item_product_status', { 'customer_item_products.status': 'item_product_status.id' })
    .join('item_product', { 'customer_item_products.item_product_id': 'item_product.item_id' })
    .join('item_product_brand', { 'item_product.brand_id': 'item_product_brand.id' })
    .join('item_product_category', { 'item_product.category_id': 'item_product_category.id' })
    .leftJoin('order_items', { 'customer_item_products.item_product_id': 'order_items.item_id' })
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

export default router;