import { ThemeProvider as BaseProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { ReactNode } from 'react';

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <BaseProvider theme={theme}>
    <CssBaseline />
    {children}
  </BaseProvider>
);
