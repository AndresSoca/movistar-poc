Table customer {
  id int [pk, increment] // auto-increment
  first_name varchar
  last_name varchar
  document_type int [ref: > document.id] // inline relationship (many-to-one)
  document_id varchar
}

Table item_service {
  item_id int [pk, ref: > item.id]
  purchable boolean
}

Table item_product {
  item_id int [pk, ref: > item.id]
  brand_id int [ref: > item_product_brand.id]
  category_id int [ref: > item_product_category.id]
}

Table document {
  id int [pk]
  name varchar
 }
 
Table order {
  code varchar [pk] // primary key
  customer_id int [not null]
  eta datetime
  created_at timestamp [note: 'When order created'] // add column note
}

Table status {
  id int [pk]
  name varchar
}

Table customer_item_products {
  customer_id int [pk, ref: > customer.id]
  item_product_id int [pk, ref: > item_product.item_id]
  start_date datetime [pk]
  end_date datetime
  status int [ref: > item_product_status.id]
}

Table customer_item_services {
  customer_id int [pk, ref: > customer.id]
  item_service_id int [pk, ref: > item_service.item_id]
  start_date datetime [pk]
  end_date datetime
  status int [ref: > item_service_status.id]
}

Table order_status {
  order_code varchar [pk, ref: > order.code]
  status_id int [pk, ref: > status.id]
  created_at timestamp [pk]
}

Table item_service_status {
  id int [pk]
  name varchar
}

Table item_product_status {
  id int [pk]
  name varchar
}

Table item_product_brand {
  id int [pk]
  name varchar
}

Table item_product_category {
  id int [pk]
  name varchar
}

Table item {
  id int [pk]
  item_type int [ref: > item_type.id]
  name varchar
}

Table item_type {
  id int [pk]
  name varchar
}

Table order_items {
  order_code varchar [pk, ref: > order.code]
  item_id int [pk, ref: > item.id, note: 'It could be item_product or item_service']
  quantity int
}

Table purchase {
  code varchar [pk]
  customer_id int [ref: > customer.id]
  description varchar
  created_at timestamp
}

Table purchase_items {
  purchase_code varchar [pk, ref: > purchase.code]
  item_id int [pk, ref: > item.id, note: 'It could be item_product or item_service']
}