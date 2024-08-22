import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import { Typography, Container, Pagination, TextField, Button } from '@mui/material';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const itemsPerPage = 10;

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get('/api/produtos', {
        params: {
          page,
          limit: itemsPerPage,
          search: searchTerm,
          minPrice,
          maxPrice
        }
      });
      setProducts(response.data.products);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  }, [page, searchTerm, minPrice, maxPrice, itemsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Lista de Produtos
      </Typography>
      <form onSubmit={handleSearch}>
        <TextField
          label="Buscar produtos"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Preço mínimo"
          variant="outlined"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Preço máximo"
          variant="outlined"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <Button type="submit" variant="contained">Buscar</Button>
      </form>
      <ProductList products={products} onProductDeleted={fetchProducts} />
      <Pagination 
        count={totalPages} 
        page={page} 
        onChange={handlePageChange} 
        color="primary" 
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
}

export default ProductListPage;
