import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, ImageList, ImageListItem } from '@mui/material';

function ProductList({ products, onProductDeleted, onProductEdited }) {
  const navigate = useNavigate();

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/produtos/${id}`);
      onProductDeleted();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  const handleEdit = (id) => {
    console.log('Editing product with id:', id);
    navigate(`/edit-product/${id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Imagens</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Código</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Preço</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <ImageList cols={3} rowHeight={100}>
                  {product.imagens && product.imagens.map((img, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={`/uploads/${img}`}
                        alt={`Produto ${product.nome}`}
                        loading="lazy"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </TableCell>
              <TableCell>{product.nome}</TableCell>
              <TableCell>{product.codigo}</TableCell>
              <TableCell>{product.descricao}</TableCell>
              <TableCell>R$ {product.preco.toFixed(2)}</TableCell>
              <TableCell>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleEdit(product.id)}
                  style={{ marginRight: '10px' }}
                >
                  Editar
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => deleteProduct(product.id)}
                >
                  Deletar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProductList;
