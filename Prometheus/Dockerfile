FROM node

# Cria a pasa dentro do container
WORKDIR /usr/src/app

# Copia todos arquivos da API
COPY . .

# Istala as depedencias
RUN npm install


# Expõe a porta qe sua api usa
EXPOSE 3000

# cmd para iniciar o app
CMD ["node", "index.js"]