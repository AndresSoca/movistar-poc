INSERT INTO "status" ("id", "name") VALUES
('1',	'started'),
('2',	'in_progress'),
('3',	'delivered');

INSERT INTO "product_status" ("id", "name") VALUES
('1',	'activated'),
('2',	'delivery_pending');

INSERT INTO "service_status" ("id", "name") VALUES
('1',	'activated'),
('2',	'pending'),
('3',	'terminated');

INSERT INTO "product_brand" ("id", "name") VALUES
('1',	'Samsung'),
('2',	'Motorola'),
('3',	'Apple');

INSERT INTO "product_category" ("id", "name") VALUES
('1',	'mobile'),
('2',	'landline');

INSERT INTO "product" ("id", "name", "brand_id", "category_id") VALUES
('1', 'Equipo telefónico inalámbrico hogar', '1', '2'),
('2', 'Moto G6', '2', '1'),
('3', 'Moto G8', '2', '1');

INSERT INTO "item_type" ("id", "name") VALUES
('1',	'product'),
('2',	'service');

INSERT INTO "document" ("id", "name") VALUES
('1',	'dni'),
('2',	'passport');

INSERT INTO "service" ("id", "name") VALUES
('1',	'Desvío de llamadas'),
('2',	'Internet 50Mb'),
('3',	'L;inea fija'),
('4',	'Tv digital'),
('5',	'Roaming'),
('6',	'Identificación de llamadas');

INSERT INTO "customer" ("first_name", "last_name", "document_type", "document_id") VALUES
('Carlos', 'López', '1', '123456789');