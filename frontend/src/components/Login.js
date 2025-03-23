import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth'; // Importa o hook de autenticação

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { login } = useAuth(); // Usa a função de login do contexto

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Faz a requisição de login para o backend
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                senha,
            });

            // Faz login com o token recebido
            login(response.data.token);

            // Redireciona o usuário (opcional)
            alert('Login realizado com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default Login;