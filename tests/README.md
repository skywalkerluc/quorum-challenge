# Testes Unitários - Quorum Challenge

Este diretório contém uma suíte completa de testes unitários para o sistema de processamento de dados legislativos.

## 📊 Cobertura de Testes

- **Statements**: 100%
- **Branches**: 95%
- **Functions**: 100%
- **Lines**: 100%

## 🧪 Estrutura dos Testes

### `/models/`
Testes para os modelos de dados:
- **VoteData.test.js**: Testa o modelo de dados de votação
- **LegislatorData.test.js**: Testa o modelo de dados de legisladores

### `/services/`
Testes para os serviços:
- **csvService.test.js**: Testa operações com arquivos CSV
- **voteProcessingService.test.js**: Testa o processamento de votos

### `/utils/`
Testes para utilitários:
- **logger.test.js**: Testa o sistema de logging
- **validators.test.js**: Testa validação de dados

### `/integration/`
Testes de integração:
- **voteProcessorApp.test.js**: Testa a aplicação principal

### `/e2e/`
Testes end-to-end:
- **realData.test.js**: Testa com dados reais

## 🚀 Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar com cobertura
npm run test:coverage
```

## 📋 Tipos de Testes

### Testes Unitários
- **Modelos**: Testam comportamento das classes de dados
- **Serviços**: Testam lógica de negócio isolada
- **Utilitários**: Testam funções auxiliares

### Testes de Integração
- **Aplicação Principal**: Testa fluxo completo com mocks
- **Tratamento de Erros**: Testa cenários de falha

### Testes E2E
- **Dados Reais**: Testa com arquivos CSV reais
- **Geração de Saída**: Verifica arquivos de saída

## 🎯 Cenários Testados

### Cenários de Sucesso
- ✅ Processamento completo de dados
- ✅ Validação de dados corretos
- ✅ Geração de arquivos de saída
- ✅ Logging estruturado

### Cenários de Erro
- ❌ Dados inválidos ou corrompidos
- ❌ Arquivos não encontrados
- ❌ Erros de processamento
- ❌ Falhas de escrita

### Cenários de Borda
- 🔄 Arrays vazios
- 🔄 Dados com valores nulos
- 🔄 Tipos de voto inválidos
- 🔄 Campos obrigatórios ausentes

## 📈 Métricas de Qualidade

- **67 testes** executados com sucesso
- **8 suites** de teste
- **0 falhas** nos testes
- **Cobertura completa** de funcionalidades críticas

## 🔧 Configuração

Os testes são configurados através do `jest.config.js`:
- Ambiente Node.js
- Cobertura de código
- Relatórios em HTML e LCOV
- Setup automático

## 📝 Padrões de Teste

### Nomenclatura
- Descritiva e em português
- Indica comportamento esperado
- Inclui cenários de borda

### Estrutura
- **Arrange**: Preparação dos dados
- **Act**: Execução da função
- **Assert**: Verificação do resultado

### Mocks
- Isolamento de dependências
- Controle de comportamento
- Verificação de interações

## 🚨 Tratamento de Erros

Os testes verificam:
- Mensagens de erro claras
- Códigos de saída corretos
- Logs de erro apropriados
- Rollback de estado

## 📊 Relatórios

Os relatórios de cobertura são gerados em:
- `coverage/lcov-report/index.html`
- `coverage/lcov.info`

## 🎉 Benefícios

- **Confiabilidade**: Código testado e validado
- **Manutenibilidade**: Refatoração segura
- **Documentação**: Testes como documentação viva
- **Qualidade**: Detecção precoce de bugs
