import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth'; // Importa o hook de autenticação

const Cadastro = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState('cliente'); // Define o tipo de usuário
    const { login } = useAuth(); // Usa a função de login do contexto

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Faz a requisição de cadastro para o backend
            const response = await axios.post('http://localhost:5000/api/auth/cadastro', {
                nome,
                email,
                senha,
                tipo,
            });

            // Faz login com o token recebido
            login(response.data.token);

            // Redireciona o usuário (opcional)
            alert('Cadastro realizado com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao cadastrar. Tente novamente.');
        }
    };

    return (
        <div>
            <h2>Cadastro</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>
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
                <div>
                    <label>Tipo de Usuário:</label>
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        <option value="cliente">Cliente</option>
                        <option value="prestador">Prestador de Serviço</option>
                    </select>
                </div>
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
};

export default Cadastro;