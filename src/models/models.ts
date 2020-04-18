import { bookshelf } from '../middlewares/db';

const ItemType = bookshelf.model('Item Type', {
    tableName: 'item_type'
});

const Item = bookshelf.model('Item', {
    tableName: 'item',
    type() {
        return this.hasOne('Item Type', 'id', 'item_type')
    },
    purchases() {
        return this.belongsToMany('Purchase').through('Purchase Items', 'item_id', 'purchase_code', 'id', 'code');
    }
});

const Customer = bookshelf.model('Customer', {
    tableName: 'customer',
    documentType() {
        return this.hasOne('Document Type', 'id', 'document_type');
    },
    products() {
        return this.belongsToMany('Product').through('Customer Products', 'customer_id', 'item_product_id', 'id', 'item_id');
    },
    services() {
        return this.belongsToMany('Service').through('Customer Services', 'customer_id', 'item_service_id', 'id', 'item_id');
    }
})

const Product = bookshelf.model('Product', {
    tableName: 'item_product',
    idAttribute: 'item_id'
})

const Service = bookshelf.model('Service', {
    tableName: 'item_service',
    idAttribute: 'item_id'
})

const CustomerProducts = bookshelf.model('Customer Products', {
    tableName: 'customer_item_products',
    customer() {
        return this.hasOne('Customer');
    },
    product() {
        return this.hasOne('Product');
    }
})

const CustomerServices = bookshelf.model('Customer Services', {
    tableName: 'customer_item_services',
    customer() {
        return this.hasOne('Customer');
    },
    service() {
        return this.hasOne('Service');
    }
})

const DocumentType = bookshelf.model('Document Type', {
    tableName: 'document'
})

const Order = bookshelf.model('Order', {
    tableName: 'order',
    idAttribute: 'code'
});

const Purchase = bookshelf.model('Purchase', {
    tableName: 'purchase',
    idAttribute: 'code',
    items() {
        return this.belongsToMany('Item').through('Purchase Items', 'purchase_code', 'item_id', 'code', 'id');
    }
});

const PurchaseItems = bookshelf.model('Purchase Items', {
    tableName: 'purchase_items',
    purchase() {
        return this.hasOne('Purchase');
    },
    item() {
        return this.hasOne('Item');
    }
});

export {
    Item,
    ItemType,
    Customer,
    DocumentType,
    Order,
    Product,
    Purchase,
    Service,
    CustomerProducts,
    CustomerServices
};