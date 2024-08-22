import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const validationSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  codigo: Yup.string().required('Código é obrigatório'),
  descricao: Yup.string(),
  preco: Yup.number().positive('Preço deve ser positivo').required('Preço é obrigatório'),
});

function EditProductModal({ open, handleClose, product, onSave }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar Produto</DialogTitle>
      <Formik
        initialValues={product}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          onSave(values);
          setSubmitting(false);
          handleClose();
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
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
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                Salvar
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

export default EditProductModal;
