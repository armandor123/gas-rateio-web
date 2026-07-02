import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../services/api';
import type { ContaMensal } from '../types/api';

export function ContasMensaisPage() {
  const [contas, setContas] = useState<ContaMensal[]>([]);

  const [mesReferencia, setMesReferencia] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [consumoInformado, setConsumoInformado] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [numeroFatura, setNumeroFatura] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function carregarContas() {
    try {
      setErro('');
      const response = await api.get<ContaMensal[]>('/contas-mensais');
      setContas(response.data);
    } catch {
      setErro('Não foi possível carregar as contas mensais. Verifique se a API está rodando.');
    }
  }

  async function cadastrarConta(event: FormEvent) {
    event.preventDefault();

    if (!mesReferencia) {
      setErro('Informe o mês de referência.');
      return;
    }

    if (!valorTotal) {
      setErro('Informe o valor total da conta.');
      return;
    }

    if (!consumoInformado) {
      setErro('Informe o consumo informado.');
      return;
    }

    if (!dataVencimento) {
      setErro('Informe a data de vencimento.');
      return;
    }

    try {
      setLoading(true);
      setErro('');
      setMensagem('');

      await api.post<ContaMensal>('/contas-mensais', {
        mesReferencia,
        valorTotal: Number(valorTotal),
        consumoInformado: Number(consumoInformado),
        dataVencimento,
        numeroFatura: numeroFatura.trim() || null,
        observacoes: observacoes.trim() || null,
      });

      setMesReferencia('');
      setValorTotal('');
      setConsumoInformado('');
      setDataVencimento('');
      setNumeroFatura('');
      setObservacoes('');

      setMensagem('Conta mensal cadastrada com sucesso.');
      await carregarContas();
    } catch (error: any) {
      const mensagemApi = error?.response?.data?.mensagem || error?.response?.data?.message;
      setErro(mensagemApi || 'Erro ao cadastrar conta mensal.');
    } finally {
      setLoading(false);
    }
  }

  function formatarMoeda(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }

  function formatarNumero(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(valor);
  }

  useEffect(() => {
    carregarContas();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Contas Mensais</h1>
          <p>Cadastro das contas mensais da concessionária.</p>
        </div>
      </div>

      <section className="panel">
        <h2>Nova conta mensal</h2>

        <form className="form" onSubmit={cadastrarConta}>
          <div className="form-group">
            <label htmlFor="mesReferencia">Mês de referência</label>
            <input
              id="mesReferencia"
              type="month"
              value={mesReferencia}
              onChange={(event) => setMesReferencia(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="valorTotal">Valor total da conta</label>
            <input
              id="valorTotal"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 10000.00"
              value={valorTotal}
              onChange={(event) => setValorTotal(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="consumoInformado">Consumo informado</label>
            <input
              id="consumoInformado"
              type="number"
              step="0.001"
              min="0"
              placeholder="Ex: 1200.000"
              value={consumoInformado}
              onChange={(event) => setConsumoInformado(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataVencimento">Data de vencimento</label>
            <input
              id="dataVencimento"
              type="date"
              value={dataVencimento}
              onChange={(event) => setDataVencimento(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="numeroFatura">Número da fatura</label>
            <input
              id="numeroFatura"
              type="text"
              placeholder="Ex: FAT-2026-06"
              value={numeroFatura}
              onChange={(event) => setNumeroFatura(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              rows={4}
              placeholder="Ex: Conta referente ao consumo de junho."
              value={observacoes}
              onChange={(event) => setObservacoes(event.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Cadastrar conta mensal'}
          </button>
        </form>

        {mensagem && <div className="alert success">{mensagem}</div>}
        {erro && <div className="alert error">{erro}</div>}
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>Contas cadastradas</h2>
          <button className="secondary" onClick={carregarContas}>
            Atualizar
          </button>
        </div>

        {contas.length === 0 ? (
          <p className="empty">Nenhuma conta mensal cadastrada.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Mês</th>
                <th>Valor total</th>
                <th>Consumo informado</th>
                <th>Vencimento</th>
                <th>Fatura</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {contas.map((conta) => (
                <tr key={conta.id}>
                  <td>{conta.id}</td>
                  <td>{conta.mesReferencia}</td>
                  <td>
                    <strong>{formatarMoeda(conta.valorTotal)}</strong>
                  </td>
                  <td>{formatarNumero(conta.consumoInformado)}</td>
                  <td>{conta.dataVencimento}</td>
                  <td>{conta.numeroFatura || '-'}</td>
                  <td>{conta.observacoes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
