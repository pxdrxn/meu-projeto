# Usa a imagem oficial do Node.js versão 16
FROM node:16

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo package.json e package-lock.json para o container
COPY package.json package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o código do projeto para o container
COPY . .

# Expõe a porta 3000 (porta padrão do React)
EXPOSE 3000

# Comando para rodar o projeto
CMD ["sh", "-c", "npm start && tail -f /dev/null"]