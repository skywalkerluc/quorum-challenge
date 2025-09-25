/**
 * Testes end-to-end com dados reais
 */
const VoteProcessorApp = require('../../src/index');

describe('E2E Tests with Real Data', () => {
  let app;

  beforeEach(() => {
    app = new VoteProcessorApp();
  });

  test('deve processar dados reais com sucesso', async () => {
    // Este teste usa os dados reais do projeto
    await expect(app.run()).resolves.not.toThrow();
  }, 30000); // Timeout de 30 segundos para dados reais

  test('deve gerar arquivos de saída corretos', async () => {
    const fs = require('fs');
    const path = require('path');

    await app.run();

    // Verifica se os arquivos foram criados
    const legislatorsPath = 'data/output/legislators-support-oppose-count.csv';
    const billsPath = 'data/output/bills.csv';

    expect(fs.existsSync(legislatorsPath)).toBe(true);
    expect(fs.existsSync(billsPath)).toBe(true);

    // Verifica se os arquivos não estão vazios
    const legislatorsContent = fs.readFileSync(legislatorsPath, 'utf8');
    const billsContent = fs.readFileSync(billsPath, 'utf8');

    expect(legislatorsContent.length).toBeGreaterThan(0);
    expect(billsContent.length).toBeGreaterThan(0);

    // Verifica se contém cabeçalhos corretos
    expect(legislatorsContent).toContain('id,name,num_supported_bills,num_opposed_bills');
    expect(billsContent).toContain('id,title,supporter_count,opposer_count,primary_sponsor');
  });
});
