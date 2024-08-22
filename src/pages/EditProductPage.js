import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container } from '@mui/material';
import EditProductForm from '../components/EditProductForm';

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleProductUpdated = () => {
    navigate('/products');
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Editar Produto
      </Typography>
      <EditProductForm productId={id} onProductUpdated={handleProductUpdated} />
    </Container>
  );
}

export default EditProductPage;
