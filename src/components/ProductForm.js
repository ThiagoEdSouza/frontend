import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const validationSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  codigo: Yup.string().required('Código é obrigatório'),
  descricao: Yup.string(),
  preco: Yup.number().positive('Preço deve ser positivo').required('Preço é obrigatório'),
});

function ProductForm({ onProductAdded }) {
  const [images, setImages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('/api/produtos', values);
      const productId = response.data.id;

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((file) => formData.append('imagens', file));
        
        await axios.post(`/api/produtos/${productId}/imagens`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      resetForm();
      setImages([]);
      setSnackbarMessage('Produto adicionado com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      if (onProductAdded) onProductAdded();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      setSnackbarMessage('Erro ao adicionar produto. Tente novamente.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (event) => {
    setImages([...images, ...event.target.files]);
  };

  return (
    <>
      <Formik
        initialValues={{ nome: '', codigo: '', descricao: '', preco: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Field
            as={TextField}
            name="nome"
            label="Nome"
            fullWidth
            margin="normal"
            error={touched.nome && errors.nome}
            helperText={touched.nome && errors.nome}
          />
          <Field
            as={TextField}
            name="codigo"
            label="Código"
            fullWidth
            margin="normal"
            error={touched.codigo && errors.codigo}
            helperText={touched.codigo && errors.codigo}
          />
          <Field
            as={TextField}
            name="descricao"
            label="Descrição"
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <Field
            as={TextField}
            name="preco"
            label="Preço"
            type="number"
            fullWidth
            margin="normal"
            error={touched.preco && errors.preco}
            helperText={touched.preco && errors.preco}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Adicionar Imagens
            </Button>
          </label>
          <Typography variant="caption" display="block" gutterBottom>
            {images.length} imagem(ns) selecionada(s)
          </Typography>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            Adicionar Produto
          </Button>
        </Form>
      )}
    </Formik>
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default ProductForm;
