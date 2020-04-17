CREATE TABLE "customer" (
  "id" SERIAL PRIMARY KEY,
  "full_name" varchar,
  "document_type" int
);

CREATE TABLE "service" (
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "product" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "brand_id" int,
  "category_id" int
);

CREATE TABLE "document" (
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "order" (
  "code" varchar PRIMARY KEY,
  "customer_id" int NOT NULL,
  "eta" timestamp,
  "created_at" timestamp
);

CREATE TABLE "status" (
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "customer_products" (
  "customer_id" int,
  "product_id" int,
  "start_date" timestamp,
  "end_date" timestamp,
  "status" int,
  PRIMARY KEY ("customer_id", "product_id")
);

CREATE TABLE "customer_services" (
  "customer_id" int,
  "service_id" int,
  "start_date" timestamp,
  "end_date" timestamp,
  "status" int,
  PRIMARY KEY ("customer_id", "service_id")
);

CREATE TABLE "order_status" (
  "order_code" varchar,
  "status_id" int,
  "created_at" timestamp,
  PRIMARY KEY ("order_code", "status_id")
);

CREATE TABLE "service_status" (
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "product_status" (
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "product_brand" (
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "product_category" (
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "item_type" (
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "order_items" (
  "order_code" varchar,
  "item_type" int,
  "item_id" int,
  "quantity" int,
  PRIMARY KEY ("order_code", "item_type", "item_id")
);

CREATE TABLE "purchase" (
  "code" varchar PRIMARY KEY,
  "customer_id" int,
  "description" varchar,
  "created_at" timestamp
);

CREATE TABLE "purchase_items" (
  "purchase_code" varchar,
  "item_type" int,
  "item_id" int,
  PRIMARY KEY ("purchase_code", "item_type", "item_id")
);

ALTER TABLE "customer" ADD FOREIGN KEY ("document_type") REFERENCES "document" ("id");

ALTER TABLE "product" ADD FOREIGN KEY ("brand_id") REFERENCES "product_brand" ("id");

ALTER TABLE "product" ADD FOREIGN KEY ("category_id") REFERENCES "product_category" ("id");

ALTER TABLE "customer_products" ADD FOREIGN KEY ("customer_id") REFERENCES "customer" ("id");

ALTER TABLE "customer_products" ADD FOREIGN KEY ("product_id") REFERENCES "product" ("id");

ALTER TABLE "customer_products" ADD FOREIGN KEY ("status") REFERENCES "product_status" ("id");

ALTER TABLE "customer_services" ADD FOREIGN KEY ("customer_id") REFERENCES "customer" ("id");

ALTER TABLE "customer_services" ADD FOREIGN KEY ("service_id") REFERENCES "service" ("id");

ALTER TABLE "customer_services" ADD FOREIGN KEY ("status") REFERENCES "service_status" ("id");

ALTER TABLE "order_status" ADD FOREIGN KEY ("order_code") REFERENCES "order" ("code");

ALTER TABLE "order_status" ADD FOREIGN KEY ("status_id") REFERENCES "status" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_code") REFERENCES "order" ("code");

ALTER TABLE "order_items" ADD FOREIGN KEY ("item_type") REFERENCES "item_type" ("id");

ALTER TABLE "purchase" ADD FOREIGN KEY ("customer_id") REFERENCES "customer" ("id");

ALTER TABLE "purchase_items" ADD FOREIGN KEY ("purchase_code") REFERENCES "purchase" ("code");

ALTER TABLE "purchase_items" ADD FOREIGN KEY ("item_type") REFERENCES "item_type" ("id");


COMMENT ON COLUMN "order"."created_at" IS 'When order created';

COMMENT ON COLUMN "order_items"."item_id" IS 'It could be product or service';

COMMENT ON COLUMN "purchase_items"."item_id" IS 'It could be product or service';
