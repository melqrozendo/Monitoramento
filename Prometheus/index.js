const express = require('express')
const client = require('prom-client'); // Biblioteca do Prometheus

const app = express();
const register = new client.Registry();

// Adiciona métricas padrãos do Nodejs (CPU, Mémoria, etc)
client.collectDefaultMetrics({ register });

// Rota principal da sua app
app.get('/', (req, res) => {
    res.send('Hey, Prometheus!');
});

// --- CRIANDO A MÉTRICA PERSONALIZADA ---
const cliqueBotaoCounter = new client.Counter({
  name: 'botao_vendas_clicado_total',
  help: 'Conta quantas vezes o botão de vendas foi clicado',
  labelNames: ['cor', 'pagina'] // Opcional: para saber qual botão foi
});

// Registrar a métrica
register.registerMetric(cliqueBotaoCounter);

// Rota que simula o clique no botão
app.get('/clicar', (req, res) => {
  // Aumenta o contador em 1
  cliqueBotaoCounter.inc({ cor: 'azul', pagina: 'home' }); 
  
  res.send('Botão clicado com sucesso!');
});

// Rota em que o Prometheus vai ler os dados
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

app.listen(3000, () => console.log('App rodando na porta 3000'));