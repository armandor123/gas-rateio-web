import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../services/api';
import type { Rateio } from '../types/api';

const CORES = ['#2563eb', '#16a34a', '#f97316', '#9333ea', '#dc2626'];

export function AnalisesPage() {
  const [rateios, setRateios] = useState<Rateio[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function carregarRateios() {
    try {
      setLoading(true);
      setErro('');

      const response = await api.get<Rateio[]>('/rateios');
      setRateios(response.data);
    } catch {
      setErro('Não foi possível carregar os dados de análise. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarRateios();
  }, []);

  const rateiosOrdenados = useMemo(() => {
    return [...rateios].sort((a, b) => a.mesReferencia.localeCompare(b.mesReferencia));
  }, [rateios]);

  const ultimoRateio = rateiosOrdenados.length > 0
    ? rateiosOrdenados[rateiosOrdenados.length - 1]
    : null;

  const dadosEvolucao = rateiosOrdenados.map((rateio) => ({
    mes: rateio.mesReferencia,
    valorTotal: rateio.valorTotalConta,
    consumoPrincipal: rateio.consumoMedidorPrincipal,
    consumoSecundario: rateio.consumoTotalSecundario,
    diferenca: rateio.diferencaConsumo,
  }));

  const nomesTorres = Array.from(
    new Set(rateiosOrdenados.flatMap((rateio) => rateio.itens.map((item) => item.nomeTorre))),
  );

  const dadosConsumoPorTorre = rateiosOrdenados.map((rateio) => {
    const linha: Record<string, string | number> = {
      mes: rateio.mesReferencia,
    };

    rateio.itens.forEach((item) => {
      linha[item.nomeTorre] = item.consumo;
    });

    return linha;
  });

  const dadosPizzaUltimoRateio = ultimoRateio
    ? ultimoRateio.itens.map((item) => ({
        name: item.nomeTorre,
        value: item.valorRateado,
        percentual: item.percentual,
      }))
    : [];

  const torreMaiorConsumo = ultimoRateio
    ? [...ultimoRateio.itens].sort((a, b) => b.consumo - a.consumo)[0]
    : null;

  const totalGeralRateado = rateios.reduce(
    (total, rateio) => total + rateio.valorTotalConta,
    0,
  );

  const mediaValorConta = rateios.length > 0
    ? totalGeralRateado / rateios.length
    : 0;

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

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Análises</h1>
          <p>Acompanhamento visual dos gastos, consumos e rateios mensais.</p>
        </div>

        <button className="secondary" onClick={carregarRateios} disabled={loading}>
          {loading ? 'Atualizando...' : 'Atualizar dados'}
        </button>
      </div>

      {erro && <div className="alert error">{erro}</div>}

      {rateios.length === 0 ? (
        <section className="panel">
          <h2>Nenhum rateio encontrado</h2>
          <p className="empty">
            Calcule pelo menos um rateio para visualizar os gráficos e indicadores.
          </p>
        </section>
      ) : (
        <>
          <div className="cards-grid">
            <div className="card">
              <span className="card-label">Última conta</span>
              <h2>{ultimoRateio ? formatarMoeda(ultimoRateio.valorTotalConta) : '-'}</h2>
              <p>{ultimoRateio ? `Mês ${ultimoRateio.mesReferencia}` : 'Sem dados'}</p>
            </div>

            <div className="card">
              <span className="card-label">Média das contas</span>
              <h2>{formatarMoeda(mediaValorConta)}</h2>
              <p>Média dos rateios calculados.</p>
            </div>

            <div className="card">
              <span className="card-label">Diferença último mês</span>
              <h2>{ultimoRateio ? formatarNumero(ultimoRateio.diferencaConsumo) : '-'}</h2>
              <p>Consumo principal menos secundários.</p>
            </div>

            <div className="card">
              <span className="card-label">Maior consumo</span>
              <h2>{torreMaiorConsumo ? torreMaiorConsumo.nomeTorre : '-'}</h2>
              <p>
                {torreMaiorConsumo
                  ? `${formatarNumero(torreMaiorConsumo.consumo)} no último rateio`
                  : 'Sem dados'}
              </p>
            </div>
          </div>

          <div className="charts-grid">
            <section className="panel chart-panel">
              <h2>Evolução do valor da conta</h2>
              <p className="chart-description">
                Mostra a evolução do valor total da conta de gás por mês.
              </p>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosEvolucao}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="valorTotal"
                      name="Valor total"
                      stroke="#2563eb"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel chart-panel">
              <h2>Consumo principal x secundário</h2>
              <p className="chart-description">
                Compara o consumo do medidor principal com a soma dos medidores secundários.
              </p>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosEvolucao}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatarNumero(Number(value))} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="consumoPrincipal"
                      name="Principal"
                      stroke="#2563eb"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="consumoSecundario"
                      name="Secundários"
                      stroke="#16a34a"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel chart-panel">
              <h2>Consumo por torre</h2>
              <p className="chart-description">
                Compara o consumo registrado por cada torre em cada mês.
              </p>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosConsumoPorTorre}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatarNumero(Number(value))} />
                    <Legend />
                    {nomesTorres.map((nomeTorre, index) => (
                      <Bar
                        key={nomeTorre}
                        dataKey={nomeTorre}
                        name={nomeTorre}
                        fill={CORES[index % CORES.length]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel chart-panel">
              <h2>Divisão do último rateio</h2>
              <p className="chart-description">
                Percentual financeiro de cada torre no último rateio calculado.
              </p>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosPizzaUltimoRateio}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      label={(item) => `${item.name}: ${formatarPercentual((item.percent ?? 0) * 100)}`}
                    >
                      {dadosPizzaUltimoRateio.map((item, index) => (
                        <Cell key={item.name} fill={CORES[index % CORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <section className="panel">
            <h2>Resumo dos rateios</h2>

            <table>
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Valor total</th>
                  <th>Consumo principal</th>
                  <th>Consumo secundário</th>
                  <th>Diferença</th>
                </tr>
              </thead>
              <tbody>
                {rateiosOrdenados.map((rateio) => (
                  <tr key={rateio.id}>
                    <td>{rateio.mesReferencia}</td>
                    <td>
                      <strong>{formatarMoeda(rateio.valorTotalConta)}</strong>
                    </td>
                    <td>{formatarNumero(rateio.consumoMedidorPrincipal)}</td>
                    <td>{formatarNumero(rateio.consumoTotalSecundario)}</td>
                    <td>{formatarNumero(rateio.diferencaConsumo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
