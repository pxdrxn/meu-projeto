import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/');
            setMessage(response.data);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    return (
        <div>
            <h1>Meu Projeto</h1>
            <button onClick={fetchData}>Testar Backend</button>
            <p>{message}</p>
        </div>
    );
}

export default App;