import { bookshelf } from '../middlewares/db';

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

export {
    Item,
    ItemType,
    Customer,
    DocumentType,
    Order
};