import React, { useState, useEffect } from 'react';
import Card from '../Components/Card/Card.jsx';
import Table from '../Components/Table/Table.jsx';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Mock products data
    setProducts([
      { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 99.99, stock: 145, status: 'In Stock' },
      { id: 2, name: 'Smart Watch', category: 'Electronics', price: 249.99, stock: 67, status: 'In Stock' },
      { id: 3, name: 'Laptop Stand', category: 'Accessories', price: 49.99, stock: 0, status: 'Out of Stock' },
      { id: 4, name: 'USB-C Cable', category: 'Accessories', price: 19.99, stock: 234, status: 'In Stock' },
      { id: 5, name: 'Mechanical Keyboard', category: 'Electronics', price: 129.99, stock: 12, status: 'Low Stock' },
      { id: 6, name: 'Webcam HD', category: 'Electronics', price: 79.99, stock: 89, status: 'In Stock' },
      { id: 7, name: 'Mouse Pad', category: 'Accessories', price: 14.99, stock: 456, status: 'In Stock' },
      { id: 8, name: 'Monitor 27"', category: 'Electronics', price: 399.99, stock: 23, status: 'In Stock' }
    ]);
  }, []);

  const columns = [
    { key: 'id', label: 'ID', render: (value) => `#${value}` },
    { key: 'name', label: 'Product Name', render: (value) => <strong>{value}</strong> },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (value) => `$${value}` },
    { key: 'stock', label: 'Stock', render: (value) => value.toLocaleString() },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`product-status ${value.toLowerCase().replace(' ', '-')}`}>
          {value}
        </span>
      )
    }
  ];

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1>Product Inventory</h1>
          <p className="page-description">Manage your product catalog</p>
        </div>
        <button className="primary-btn">➕ Add Product</button>
      </div>

      <div className="products-stats">
        <div className="product-stat">
          <span className="product-stat-icon">📦</span>
          <div>
            <p className="product-stat-label">Total Products</p>
            <h3 className="product-stat-value">{products.length}</h3>
          </div>
        </div>
        <div className="product-stat">
          <span className="product-stat-icon">✅</span>
          <div>
            <p className="product-stat-label">In Stock</p>
            <h3 className="product-stat-value">
              {products.filter(p => p.status === 'In Stock').length}
            </h3>
          </div>
        </div>
        <div className="product-stat">
          <span className="product-stat-icon">⚠️</span>
          <div>
            <p className="product-stat-label">Low Stock</p>
            <h3 className="product-stat-value">
              {products.filter(p => p.status === 'Low Stock').length}
            </h3>
          </div>
        </div>
      </div>

      <Card title="All Products" subtitle={`${products.length} products`} noPadding>
        <Table columns={columns} data={products} />
      </Card>
    </div>
  );
};

export default Products;