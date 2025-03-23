import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth(); // Obtém o token do contexto de autenticação

    // Se o usuário não estiver autenticado, redireciona para a página de login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Se o usuário estiver autenticado, renderiza o componente filho
    return children;
};

export default ProtectedRoute;