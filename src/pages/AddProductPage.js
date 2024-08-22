import React from 'react';
import ProductForm from '../components/ProductForm';
import { useNavigate } from 'react-router-dom';
import { Typography, Container } from '@mui/material';

function AddProductPage() {
  const navigate = useNavigate();

  const handleProductAdded = () => {
    navigate('/products');
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Adicionar Novo Produto
      </Typography>
      <ProductForm onProductAdded={handleProductAdded} />
    </Container>
  );
}

export default AddProductPage;
