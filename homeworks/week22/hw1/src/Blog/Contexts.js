import { createContext } from 'react';


const AuthContext = createContext(null);

const LoadingContext = createContext(null);
export {
    AuthContext,
    LoadingContext
}