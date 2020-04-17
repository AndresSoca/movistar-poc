Table customer {
  id int [pk, increment] // auto-increment
  full_name varchar
  document_type int [ref: > document.id] // inline relationship (many-to-one)
}

Table service {
  id int [pk]
  name varchar
}

Table product {
  id int [pk]
  name varchar
  brand_id int [ref: > product_brand.id]
  category_id int [ref: > product_category.id]
}

Table document {
  id int [pk]
  name varchar
 }
 
Table order {
  code varchar [pk] // primary key
  customer_id int [not null]
  eta datetime
  created_at varchar [note: 'When order created'] // add column note
}

Table status {
  id int [pk]
  name varchar
}

Table customer_products {
  customer_id int [pk, ref: > customer.id]
  product_id int [pk, ref: > product.id]
  start_date datetime
  end_date datetime
  status int [ref: > product_status.id]
}

Table customer_services {
  customer_id int [pk, ref: > customer.id]
  service_id int [pk, ref: > service.id]
  start_date datetime
  end_date datetime
  status int [ref: > service_status.id]
}

Table order_status {
  order_code int [pk, ref: > order.code]
  status_id int [pk, ref: > status.id]
  created_at timestamp
}

Table service_status {
  id int [pk]
  name varchar
}

Table product_status {
  id int [pk]
  name varchar
}

Table product_brand {
  id int [pk]
  name varchar
}

Table product_category {
  id int [pk]
  name varchar
}

Table item_type {
  id int [pk]
  name varchar
}

Table order_items {
  order_code int [pk, ref: > order.code]
  item_type int [pk, ref: > item_type.id]
  item_id int [pk, note: 'It could be product or service']
  quantity int
}

Table purchase {
  code varchar [pk]
  customer_id int [pk, ref: > customer.id]
  description varchar
  created_at timestamp
}

Table purchase_items {
  purchase_code varchar [pk, ref: > purchase.code]
  item_type int [ref: > item_type.id]
  item_id int
}