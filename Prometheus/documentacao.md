Como monitorar aplicações e Docker com Prometheus e Grafana
link: https://www.youtube.com/watch?v=mwIQJ1m9ulY

1-Observabilidade e acompanhamento de metricas da aplicacao e infra
2-Instalar o prometheus ferramenta opensource
link: https://prometheus.io/docs/instrumenting/clientlibs/
Sobre o Prometheus server:
Retrieval
TSDB
HttP server

*******SOBRE*************
Prometheus é uma ferramenta junto com o Grafana para obter metricas para saber a saúde da aplicação.
Por Exemplo:
- Consumo de CPU
- Consumo de Memória
- Latência
- Quantidade de chamadas de Aplicação

As métricas podem ser do tipo: 
- De Sistemas (cpu, memoria, chamadas de endpint)
- De Negocios ( quantidade de boletos emitidos, quantidade de compras no cartão)

Obs que existe os níveis de serviço como: SLi, SLO, SLA
SLI (Service Level Indicador), exemplo de uso: tempo de carregamento de pagina de um ecommerce.
SLO (Service Level Objective), exemplo de uso: Define o tempo de 2 seg por carregamento em 95% dos casos.
SLA (Service Level Agreement), exemplo de uso: No contrato feito foi acordado que a pagina devem carregar em torno de T=2seg

3-Como configurar o arq. do <prometheus.yaml>
3.1-definir os parametros <global>:
<scrape_interval>: tempo de coleta de metricas
<scrape_timeout>: tempo de espera que o prometheus retorna informaçãos

Obs: ele coleta informações de um endpoint que foi definido, sendo o global é para todos os endpoints

3.2-definir o parametro de <scrape_configs>:
defino toda as configuração de coleta dos endpoints


4-Instalar o logar na ferramenta Grafana
link: https://grafana.com/
Grafana é um vizualizador de metricas

***********Projeto envolvendo: App Node, Prometheus, Grafana, Docker***********
Essa é uma ótima escolha para começar no mundo da observabilidade. Para um iniciante, a melhor forma de visualizar isso é como uma "linha de produção" de dados:
- Sua App Node.js: Gera os dados (ex: "recebi 10 visitas").
- Prometheus: É o "coletor" que passa na sua app de tempos em tempos e anota esses dados.
- Grafana: É o "artista" que pega as anotações do Prometheus e desenha gráficos bonitos.
- Docker: É a "caixa" onde cada um desses mora, garantindo que tudo funcione em qualquer computador.

1-Preparando projeto do App Node:
### npm init -y
### npm install express prom-client

2-Criar os arquivos
- index.js
- docker-compose.yml
- prometheus.yaml
- Dockerfile

3-comandos para rodar app:
### docker-compose up OU docker-compose up --build OU docker-compose up -d --build

4-Como saber se deu certo (sem o docker ps):

Tente abrir estas 3 abas no seu navegador:

    App: http://localhost:3000/metrics (Deve mostrar um monte de texto técnico).

    Prometheus: http://localhost:9090 (Deve abrir a interface azul do Prometheus).

    Grafana: http://localhost:3001 (Deve abrir a tela de login).

5-Configurando o Grafana:

    Acesse http://localhost:3001 (User: admin / Senha: admin).

    Vá em Connections -> Data Sources -> Add Data Source.

    Escolha Prometheus. No campo URL, digite: http://prometheus:9090.

    Clique em Save & Test.

********************************************************************
1. Acesse e Conecte o Prometheus

O Grafana é apenas uma tela em branco; ele precisa saber de onde puxar os dados.

    Abra http://localhost:3001 no navegador (Login/Senha: admin).

    No menu lateral esquerdo, clique em Connections (ícone de tomada) > Data Sources.

    Clique em Add data source e selecione Prometheus.

    No campo Connection, digite a URL interna do Docker: http://prometheus:9090.

    Role até o final e clique em Save & Test. Se aparecer uma mensagem verde ("Successfully queried the Prometheus API"), você está pronto!

2. Crie o Dashboard

    No menu lateral, clique no ícone de Dashboards (quadradinhos) > New > Dashboard.

    Clique no botão + Add Visualization.

    Selecione o Prometheus como fonte de dados.

3. Escreva sua primeira Query (Pergunta)

Agora você vai dizer ao Grafana o que quer ver. No campo Metrics browser ou Query, tente estas métricas que sua app Node.js já está enviando:

    Uso de Memória Heap: Digite nodejs_heap_size_total_bytes e clique em Run Query.

    Total de Requisições: Digite http_requests_total (se você configurou um contador).

    Event Loop Lag: Digite nodejs_eventloop_lag_seconds.

4. Estilize o Gráfico

No painel da direita, você pode personalizar tudo:

    Title: Dê um nome (ex: "Consumo de Memória RAM").

    Graph styles: Mude de linhas para barras ou áreas preenchidas.

    Unit: Procure por "Data (Metric)" > "bytes" (para a métrica de memória).

Dica de Ouro: Clique no botão Apply no canto superior direito para salvar esse gráfico no seu painel.
5. O Atalho: Dashboards Prontos

Você não precisa criar tudo do zero. A comunidade já criou painéis incríveis para Node.js.

    Vá em Dashboards > New > Import.

    No campo "Import via grafana.com", digite o ID 11159 (um dos melhores para Node.js) e clique em Load.

    Selecione o seu Data Source do Prometheus e clique em Import.

O que observar agora:

Tente abrir a aba da sua aplicação (http://localhost:3000) e dar vários F5 (Refresh). Depois de alguns segundos, você verá as linhas do gráfico no Grafana subindo!
********************************************************************


Obs: O erro "No Data" no dashboard importado (ID 11159) é muito comum e geralmente acontece por um destes três motivos: as métricas do dashboard têm nomes diferentes das métricas que sua app envia, o intervalo de tempo está errado, ou o Prometheus ainda não "carimbou" os dados.

********METRICAS DE BOTAO DE VENDAS***********
1. Como testar a nova métrica

    Reinicie o container: Como você alterou o código, rode docker-compose up --build.

    Gere dados: Abra o navegador e acesse http://localhost:3000/clicar algumas vezes. Cada vez que você der Refresh, o número vai subir.

    Verifique os dados brutos: Acesse http://localhost:3000/metrics. Procure pela linha botao_vendas_clicado_total. Ela deve estar assim:
    botao_vendas_clicado_total{cor="azul",pagina="home"} 5

2. Visualizando no Grafana

Agora que o Prometheus está coletando esse "5", vamos desenhar:

    No Grafana, crie um New Visualization.

    Na Query, digite o nome que demos: botao_vendas_clicado_total.

    Dica crucial para iniciantes: Como um contador sempre sobe, o gráfico de linha vai ser uma subida eterna. Para ver "quantos cliques por minuto", use a função rate:
    rate(botao_vendas_clicado_total[1m])

    No painel lateral, mude o tipo de gráfico para Stat (aquele que mostra um número grandão colorido).

***************************************************
OBS: Podemos adicionar um ALERT par verificar quantos vezes o botão foi clicado
Essa é a parte onde o monitoramento se torna "inteligente". Em vez de você ficar olhando para o gráfico o tempo todo, o sistema te avisa quando algo sai do normal.

No ecossistema que estamos usando, os alertas geralmente seguem este fluxo:

    Prometheus: Avalia a regra (Ex: "Cliques > 10").

    Alertmanager: Recebe o alerta e decide para onde enviar (E-mail, Slack, Discord, Telegram).

Para mantermos simples agora, vamos configurar o alerta diretamente no Grafana, pois ele tem uma interface visual muito fácil para iniciantes