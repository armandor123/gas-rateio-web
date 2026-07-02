import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../services/api';
import type { Rateio } from '../types/api';

export function RateiosPage() {
  const [rateios, setRateios] = useState<Rateio[]>([]);
  const [rateioSelecionado, setRateioSelecionado] = useState<Rateio | null>(null);

  const [mesReferencia, setMesReferencia] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function carregarRateios() {
    try {
      setErro('');
      const response = await api.get<Rateio[]>('/rateios');
      setRateios(response.data);
    } catch {
      setErro('Não foi possível carregar os rateios. Verifique se a API está rodando.');
    }
  }

  async function calcularRateio(event: FormEvent) {
    event.preventDefault();

    if (!mesReferencia) {
      setErro('Informe o mês de referência.');
      return;
    }

    try {
      setLoading(true);
      setErro('');
      setMensagem('');

      const response = await api.post<Rateio>('/rateios/calcular', {
        mesReferencia,
      });

      setRateioSelecionado(response.data);
      setMensagem('Rateio calculado com sucesso.');
      await carregarRateios();
    } catch (error: any) {
      const mensagemApi = error?.response?.data?.mensagem || error?.response?.data?.message;
      setErro(mensagemApi || 'Erro ao calcular rateio.');
    } finally {
      setLoading(false);
    }
  }

  async function buscarRateioPorMes() {
    if (!mesReferencia) {
      setErro('Informe o mês de referência para buscar.');
      return;
    }

    try {
      setLoading(true);
      setErro('');
      setMensagem('');

      const response = await api.get<Rateio>(`/rateios/${mesReferencia}`);
      setRateioSelecionado(response.data);
      setMensagem('Rateio encontrado com sucesso.');
    } catch (error: any) {
      const mensagemApi = error?.response?.data?.mensagem || error?.response?.data?.message;
      setErro(mensagemApi || 'Rateio não encontrado para o mês informado.');
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

  function formatarPercentual(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor) + '%';
  }

  function selecionarRateio(rateio: Rateio) {
    setRateioSelecionado(rateio);
    setMesReferencia(rateio.mesReferencia);
    setMensagem('');
    setErro('');
  }

  useEffect(() => {
    carregarRateios();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Rateios</h1>
          <p>Cálculo e consulta dos rateios mensais.</p>
        </div>
      </div>

      <section className="panel">
        <h2>Calcular ou buscar rateio</h2>

        <form className="form" onSubmit={calcularRateio}>
          <div className="form-group">
            <label htmlFor="mesReferencia">Mês de referência</label>
            <input
              id="mesReferencia"
              type="month"
              value={mesReferencia}
              onChange={(event) => setMesReferencia(event.target.value)}
            />
          </div>

          <div className="actions-row">
            <button type="submit" disabled={loading}>
              {loading ? 'Processando...' : 'Calcular rateio'}
            </button>

            <button
              type="button"
              className="secondary"
              onClick={buscarRateioPorMes}
              disabled={loading}
            >
              Buscar por mês
            </button>
          </div>
        </form>

        {mensagem && <div className="alert success">{mensagem}</div>}
        {erro && <div className="alert error">{erro}</div>}
      </section>

      {rateioSelecionado && (
        <section className="panel">
          <div className="section-title">
            <h2>Resultado do rateio — {rateioSelecionado.mesReferencia}</h2>
          </div>

          <div className="cards-grid">
            <div className="card">
              <span className="card-label">Valor total da conta</span>
              <h2>{formatarMoeda(rateioSelecionado.valorTotalConta)}</h2>
              <p>Valor total informado na conta mensal.</p>
            </div>

            <div className="card">
              <span className="card-label">Consumo secundário</span>
              <h2>{formatarNumero(rateioSelecionado.consumoTotalSecundario)}</h2>
              <p>Soma dos consumos das torres.</p>
            </div>

            <div className="card">
              <span className="card-label">Diferença de consumo</span>
              <h2>{formatarNumero(rateioSelecionado.diferencaConsumo)}</h2>
              <p>Principal menos soma dos secundários.</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Torre</th>
                <th>Medidor ID</th>
                <th>Consumo</th>
                <th>Percentual</th>
                <th>Valor rateado</th>
              </tr>
            </thead>
            <tbody>
              {rateioSelecionado.itens.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.nomeTorre}</strong>
                  </td>
                  <td>{item.medidorId}</td>
                  <td>{formatarNumero(item.consumo)}</td>
                  <td>{formatarPercentual(item.percentual)}</td>
                  <td>
                    <strong>{formatarMoeda(item.valorRateado)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="panel">
        <div className="section-title">
          <h2>Rateios calculados</h2>
          <button className="secondary" onClick={carregarRateios}>
            Atualizar
          </button>
        </div>

        {rateios.length === 0 ? (
          <p className="empty">Nenhum rateio calculado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Mês</th>
                <th>Valor total</th>
                <th>Consumo principal</th>
                <th>Consumo secundário</th>
                <th>Diferença</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rateios.map((rateio) => (
                <tr key={rateio.id}>
                  <td>{rateio.id}</td>
                  <td>{rateio.mesReferencia}</td>
                  <td>
                    <strong>{formatarMoeda(rateio.valorTotalConta)}</strong>
                  </td>
                  <td>{formatarNumero(rateio.consumoMedidorPrincipal)}</td>
                  <td>{formatarNumero(rateio.consumoTotalSecundario)}</td>
                  <td>{formatarNumero(rateio.diferencaConsumo)}</td>
                  <td>
                    <button
                      type="button"
                      className="secondary compact"
                      onClick={() => selecionarRateio(rateio)}
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
