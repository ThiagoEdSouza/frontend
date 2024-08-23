import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Snackbar, Typography, Button } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import {
  PageContainer,
  Title,
  StyledForm,
  StyledTextField,
  ImagePreviewContainer,
  ImagePreview,
  PreviewImage,
  RemoveButton,
  SubmitButton
} from './EditProductPage.styles';

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
      console.log('Submitting updated values:', values);
      const updatedValues = { 
        ...values, 
        imagens: images.filter(img => typeof img === 'string') 
      };
      
      const response = await axios.put(`/api/produtos/${id}`, updatedValues);
      console.log('Update response:', response.data);
      
      if (images.some(img => img instanceof File)) {
        const formData = new FormData();
        images.forEach((file) => {
          if (file instanceof File) {
            formData.append('imagens', file);
          }
        });
        
        if (formData.has('imagens')) {
          const imageResponse = await axios.post(`/api/produtos/${id}/imagens`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          console.log('Image upload response:', imageResponse.data);
        }
      }
  
      setSnackbarMessage('Produto atualizado com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      setTimeout(() => {
        navigate('/products');
      }, 2000);
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
    <PageContainer>
      <Title>Editar Produto</Title>
      <Formik
  initialValues={product}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {({ errors, touched, isSubmitting }) => (
    <Form>
      <Field
        as={StyledTextField}
        name="nome"
        label="Nome"
        fullWidth
        error={touched.nome && errors.nome}
        helperText={touched.nome && errors.nome}
      />
      <Field
        as={StyledTextField}
        name="codigo"
        label="Código"
        fullWidth
        error={touched.codigo && errors.codigo}
        helperText={touched.codigo && errors.codigo}
      />
      <Field
        as={StyledTextField}
        name="descricao"
        label="Descrição"
        fullWidth
        multiline
        rows={4}
      />
      <Field
        as={StyledTextField}
        name="preco"
        label="Preço"
        type="number"
        fullWidth
        error={touched.preco && errors.preco}
        helperText={touched.preco && errors.preco}
      />
            
            {/* Bloco para exibir e gerenciar imagens */}
            <ImagePreviewContainer>
        {images.map((image, index) => (
          <ImagePreview key={index}>
            <PreviewImage 
              src={typeof image === 'string' ? `/uploads/${image}` : URL.createObjectURL(image)} 
              alt={`Produto ${index}`} 
            />
            <RemoveButton onClick={() => handleImageRemove(index)} size="small">
              X
            </RemoveButton>
          </ImagePreview>
        ))}
      </ImagePreviewContainer>

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
      <SubmitButton type="submit" variant="contained" color="primary" disabled={isSubmitting}>
        Atualizar Produto
      </SubmitButton>
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
  </PageContainer>
);
}

export default EditProductPage;
