import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import ProductListPage from './pages/ProductListPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Nunes Sports
          </Typography>
          <Button color="inherit" component={Link} to="/products">
            Listar Produtos
          </Button>
          <Button color="inherit" component={Link} to="/add-product">
            Adicionar Produto
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
      <Routes>
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/edit-product/:id" element={<EditProductPage />} />
        <Route path="/" element={<ProductListPage />} />
      </Routes>
      </Container>
    </Router>
  );
}

export default App;