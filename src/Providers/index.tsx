import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { MondayApiProvider } from './MondayApiProvider';

export const Providers = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>
    <MondayApiProvider>{children}</MondayApiProvider>
  </ThemeProvider>
);
