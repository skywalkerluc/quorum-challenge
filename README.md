# Quorum Challenge - Processador de Dados Legislativos

Sistema para processamento de dados de votação legislativa que gera relatórios de suporte e oposição para projetos de lei e legisladores.

## 🚀 Funcionalidades

- **Processamento de Dados**: Analisa dados de votação de projetos de lei
- **Relatórios de Legisladores**: Gera contagem de projetos apoiados e opostos por legislador
- **Relatórios de Projetos**: Gera contagem de apoiadores e opositores por projeto de lei
- **Validação de Dados**: Validação robusta de dados de entrada
- **Logging Estruturado**: Sistema de logs detalhado para monitoramento
- **Tratamento de Erros**: Tratamento robusto de erros com mensagens claras

## 📁 Estrutura do Projeto

```
src/
├── config/
│   └── constants.js          # Constantes e configurações
├── models/
│   ├── VoteData.js           # Modelo para dados de votação
│   └── LegislatorData.js     # Modelo para dados de legisladores
├── services/
│   ├── csvService.js         # Serviço para operações CSV
│   └── voteProcessingService.js # Serviço principal de processamento
├── utils/
│   ├── logger.js             # Sistema de logging
│   └── validators.js         # Validadores de dados
└── index.js                  # Aplicação principal
```

## 🛠️ Instalação

```bash
npm install
```

## 🏃‍♂️ Execução

```bash
# Execução normal
npm start

# Execução com debug
npm run dev
```

## 📊 Dados de Entrada

O sistema processa os seguintes arquivos CSV:

- `data/input/votes.csv` - Dados de votação
- `data/input/vote_results.csv` - Resultados de votação
- `data/input/bills.csv` - Projetos de lei
- `data/input/legislators.csv` - Legisladores

## 📈 Dados de Saída

O sistema gera os seguintes arquivos CSV:

- `data/output/legislators-support-oppose-count.csv` - Contagem de suporte/oposição por legislador
- `data/output/bills.csv` - Contagem de apoiadores/opositores por projeto de lei

## 🔧 Melhorias Implementadas

### Arquitetura
- **Separação de Responsabilidades**: Código organizado em módulos específicos
- **Padrão de Classes**: Uso de classes para melhor encapsulamento
- **Injeção de Dependências**: Serviços modulares e reutilizáveis

### Qualidade do Código
- **Nomes Descritivos**: Variáveis e funções com nomes claros e significativos
- **Documentação**: Comentários JSDoc em todas as funções
- **Validação Robusta**: Validação completa de dados de entrada
- **Tratamento de Erros**: Sistema robusto de tratamento de erros

### Performance
- **Algoritmos Otimizados**: Redução de complexidade algorítmica
- **Processamento Paralelo**: Leitura de arquivos em paralelo
- **Estruturas de Dados Eficientes**: Uso de Maps para acesso O(1)

### Monitoramento
- **Logging Estruturado**: Logs em formato JSON com níveis configuráveis
- **Métricas Detalhadas**: Contagem de registros processados
- **Rastreamento de Erros**: Stack traces completos para debugging

### Manutenibilidade
- **Configuração Centralizada**: Constantes em arquivo dedicado
- **Código Modular**: Fácil manutenção e extensão
- **Testabilidade**: Estrutura preparada para testes unitários

## 📝 Exemplo de Uso

```javascript
const VoteProcessorApp = require('./src/index');

const app = new VoteProcessorApp();
await app.run();
```

## 🐛 Debugging

Para ativar logs de debug, modifique o nível no arquivo `src/utils/logger.js`:

```javascript
this.currentLevel = this.levels.DEBUG;
```

## 📋 Requisitos

- Node.js >= 14.0.0
- npm >= 6.0.0

## 📄 Licença

ISC