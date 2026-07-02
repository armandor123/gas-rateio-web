import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../services/api';
import type { Leitura, Medidor } from '../types/api';

export function LeiturasPage() {
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [medidores, setMedidores] = useState<Medidor[]>([]);

  const [medidorId, setMedidorId] = useState('');
  const [mesReferencia, setMesReferencia] = useState('');
  const [dataLeitura, setDataLeitura] = useState('');
  const [leituraAnterior, setLeituraAnterior] = useState('');
  const [leituraAtual, setLeituraAtual] = useState('');

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function carregarLeituras() {
    try {
      setErro('');
      const response = await api.get<Leitura[]>('/leituras');
      setLeituras(response.data);
    } catch {
      setErro('Não foi possível carregar as leituras. Verifique se a API está rodando.');
    }
  }

  async function carregarMedidores() {
    try {
      const response = await api.get<Medidor[]>('/medidores');
      setMedidores(response.data);
    } catch {
      setErro('Não foi possível carregar os medidores.');
    }
  }

  async function registrarLeitura(event: FormEvent) {
    event.preventDefault();

    if (!medidorId) {
      setErro('Selecione um medidor.');
      return;
    }

    if (!mesReferencia) {
      setErro('Informe o mês de referência.');
      return;
    }

    if (!dataLeitura) {
      setErro('Informe a data da leitura.');
      return;
    }

    if (!leituraAnterior) {
      setErro('Informe a leitura anterior.');
      return;
    }

    if (!leituraAtual) {
      setErro('Informe a leitura atual.');
      return;
    }

    try {
      setLoading(true);
      setErro('');
      setMensagem('');

      await api.post<Leitura>('/leituras', {
        medidorId: Number(medidorId),
        mesReferencia,
        dataLeitura,
        leituraAnterior: Number(leituraAnterior),
        leituraAtual: Number(leituraAtual),
      });

      setMedidorId('');
      setMesReferencia('');
      setDataLeitura('');
      setLeituraAnterior('');
      setLeituraAtual('');

      setMensagem('Leitura registrada com sucesso.');
      await carregarLeituras();
    } catch (error: any) {
      const mensagemApi = error?.response?.data?.mensagem || error?.response?.data?.message;
      setErro(mensagemApi || 'Erro ao registrar leitura.');
    } finally {
      setLoading(false);
    }
  }

  function obterNomeMedidor(id: number) {
    const medidor = medidores.find((item) => item.id === id);
    return medidor ? `${medidor.nome} (${medidor.codigo})` : `ID ${id}`;
  }

  function formatarNumero(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(valor);
  }

  const consumoPrevisto =
    leituraAnterior && leituraAtual
      ? Number(leituraAtual) - Number(leituraAnterior)
      : null;

  useEffect(() => {
    carregarMedidores();
    carregarLeituras();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Leituras</h1>
          <p>Registro das leituras mensais dos medidores.</p>
        </div>
      </div>

      <section className="panel">
        <h2>Nova leitura</h2>

        <form className="form" onSubmit={registrarLeitura}>
          <div className="form-group">
            <label htmlFor="medidorId">Medidor</label>
            <select
              id="medidorId"
              value={medidorId}
              onChange={(event) => setMedidorId(event.target.value)}
            >
              <option value="">Selecione um medidor</option>
              {medidores.map((medidor) => (
                <option key={medidor.id} value={medidor.id}>
                  {medidor.nome} - {medidor.tipo === 'PRINCIPAL' ? 'Principal' : 'Secundário'}
                </option>
              ))}
            </select>
          </div>

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
            <label htmlFor="dataLeitura">Data da leitura</label>
            <input
              id="dataLeitura"
              type="date"
              value={dataLeitura}
              onChange={(event) => setDataLeitura(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="leituraAnterior">Leitura anterior</label>
            <input
              id="leituraAnterior"
              type="number"
              step="0.001"
              min="0"
              placeholder="Ex: 10000.000"
              value={leituraAnterior}
              onChange={(event) => setLeituraAnterior(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="leituraAtual">Leitura atual</label>
            <input
              id="leituraAtual"
              type="number"
              step="0.001"
              min="0"
              placeholder="Ex: 11200.000"
              value={leituraAtual}
              onChange={(event) => setLeituraAtual(event.target.value)}
            />
          </div>

          {consumoPrevisto !== null && (
            <div className={consumoPrevisto < 0 ? 'alert error' : 'alert success'}>
              Consumo previsto: {formatarNumero(consumoPrevisto)}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Registrar leitura'}
          </button>
        </form>

        {mensagem && <div className="alert success">{mensagem}</div>}
        {erro && <div className="alert error">{erro}</div>}
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>Leituras cadastradas</h2>
          <button className="secondary" onClick={carregarLeituras}>
            Atualizar
          </button>
        </div>

        {leituras.length === 0 ? (
          <p className="empty">Nenhuma leitura cadastrada.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Medidor</th>
                <th>Mês</th>
                <th>Data</th>
                <th>Leitura anterior</th>
                <th>Leitura atual</th>
                <th>Consumo</th>
              </tr>
            </thead>
            <tbody>
              {leituras.map((leitura) => (
                <tr key={leitura.id}>
                  <td>{leitura.id}</td>
                  <td>{obterNomeMedidor(leitura.medidorId)}</td>
                  <td>{leitura.mesReferencia}</td>
                  <td>{leitura.dataLeitura}</td>
                  <td>{formatarNumero(leitura.leituraAnterior)}</td>
                  <td>{formatarNumero(leitura.leituraAtual)}</td>
                  <td>
                    <strong>{formatarNumero(leitura.consumo)}</strong>
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
