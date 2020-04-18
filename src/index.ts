import express from 'express';
import bodyParser from 'body-parser';
import { knex } from './middlewares/db';

// routes
import healthCheckRoutes from './routes/healthCheck';
import customerRoutes from './routes/customer';
import purchaseRoutes from './routes/purchase';
import productsRoutes from './routes/products';
import servicesRoutes from './routes/services';
import orderRoutes from './routes/order';

const PORT = process.env.PORT || 3000;

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// routes
app.use('/health-check', healthCheckRoutes);
app.use('/customer', customerRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/products', productsRoutes);
app.use('/services', servicesRoutes);
app.use('/order', orderRoutes);

async function assertDatabaseConnection() {
  return knex.raw('select 1+1 as result')
    .catch((err: any) => {
      console.log('[Fatal] Failed to establish connection to database! Exiting...');
      console.log(err);
      process.exit(1);
    });
}

(async () => {
  await assertDatabaseConnection();

  app.listen(PORT, () => {
    console.log("Started at http://localhost:%d", PORT);
  });
})();
