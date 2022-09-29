import { createContext } from 'react';
import { IKContextCombinedProps } from './props';

export const ImageKitContextType = createContext<IKContextCombinedProps | null>(null);
