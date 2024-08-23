import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableHead, TableRow, Paper, TableContainer } from '@mui/material';
import { 
  StyledTableCell, 
  ActionButton, 
  ImageContainer, 
  ProductImage 
} from './ProductList.styles';

function ProductList({ products, onProductDeleted }) {
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
            <StyledTableCell>Imagens</StyledTableCell>
            <StyledTableCell>Nome</StyledTableCell>
            <StyledTableCell>Código</StyledTableCell>
            <StyledTableCell>Descrição</StyledTableCell>
            <StyledTableCell>Preço</StyledTableCell>
            <StyledTableCell>Ações</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <StyledTableCell>
              <ImageContainer>
                {product.imagens && Array.isArray(product.imagens) && product.imagens.map((img, index) => (
                  <ProductImage key={index} src={`/uploads/${img}`} alt={`Produto ${product.nome}`} />
                ))}
              </ImageContainer>
              </StyledTableCell>
              <StyledTableCell>{product.nome}</StyledTableCell>
              <StyledTableCell>{product.codigo}</StyledTableCell>
              <StyledTableCell>{product.descricao}</StyledTableCell>
              <StyledTableCell>R$ {product.preco.toFixed(2)}</StyledTableCell>
              <StyledTableCell>
                <ActionButton 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleEdit(product.id)}
                >
                  Editar
                </ActionButton>
                <ActionButton 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => deleteProduct(product.id)}
                >
                  Deletar
                </ActionButton>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProductList;