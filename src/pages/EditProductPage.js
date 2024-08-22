import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography, Container, Snackbar, Box } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const validationSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  codigo: Yup.string().required('Código é obrigatório'),
  descricao: Yup.string(),
  preco: Yup.number().positive('Preço deve ser positivo').required('Preço é obrigatório'),
});

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with id:', id);
        const response = await axios.get(`/api/produtos/${id}`);
        console.log('Product data received:', response.data);
        if (response.data) {
          setProduct(response.data);
          setImages(response.data.imagens || []);
        } else {
          console.error('Produto não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        console.error('Erro detalhado:', error.response ? error.response.data : error.message);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Inclui as imagens atuais no objeto de valores
      const updatedValues = { ...values, imagens: images };
      
      await axios.put(`/api/produtos/${id}`, updatedValues);
      
      if (images.some(img => img instanceof File)) {
        const formData = new FormData();
        images.forEach((file) => {
          if (file instanceof File) {
            formData.append('imagens', file);
          }
        });
        
        if (formData.has('imagens')) {
          await axios.post(`/api/produtos/${id}/imagens`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      }
  
      setSnackbarMessage('Produto atualizado com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => navigate('/products'), 2000);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      setSnackbarMessage('Erro ao atualizar produto. Tente novamente.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (event) => {
    const newImages = Array.from(event.target.files);
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  // Adiciona a função de remoção de imagens
  const handleImageRemove = (index) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  if (!product) return <Typography>Carregando...</Typography>;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Editar Produto
      </Typography>
      <Formik
        initialValues={product}
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
            
            {/* Bloco para exibir e gerenciar imagens */}
            <Box mt={2} mb={2}>
              {images.map((image, index) => (
                <Box key={index} display="inline-block" mr={1} mb={1}>
                  {typeof image === 'string' ? (
                    <img src={`/uploads/${image}`} alt={`Produto ${index}`} width="100" />
                  ) : (
                    <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} width="100" />
                  )}
                  <Button onClick={() => handleImageRemove(index)} size="small">Remover</Button>
                </Box>
              ))}
            </Box>

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
              Atualizar Produto
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
    </Container>
  );
}

export default EditProductPage;
