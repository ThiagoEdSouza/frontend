import styled from 'styled-components';
import { TableCell, Button } from '@mui/material';

export const StyledTableCell = styled(TableCell)`
  padding: 16px;
`;

export const ActionButton = styled(Button)`
  margin-right: 8px;
`;

export const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
`;
