import styled from 'styled-components';
import { TextField, Button } from '@mui/material';

export const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

export const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const StyledTextField = styled(TextField)`
  margin-bottom: 16px;
`;

export const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

export const ImagePreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const RemoveButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  min-width: 30px;
  width: 30px;
  height: 30px;
  padding: 0;
  background-color: rgba(255, 255, 255, 0.7);
  color: #f44336;
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
`;

export const SubmitButton = styled(Button)`
  margin-top: 20px;
`;

