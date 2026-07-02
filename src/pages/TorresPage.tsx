import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../services/api';
import type { Torre } from '../types/api';

export function TorresPage() {
  const [torres, setTorres] = useState<Torre[]>([]);
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function carregarTorres() {
    try {
      setErro('');
      const response = await api.get<Torre[]>('/torres');
      setTorres(response.data);
    } catch {
      setErro('Não foi possível carregar as torres. Verifique se a API está rodando.');
    }
  }

  async function cadastrarTorre(event: FormEvent) {
    event.preventDefault();

    if (!nome.trim()) {
      setErro('Informe o nome da torre.');
      return;
    }

    try {
      setLoading(true);
      setErro('');
      setMensagem('');

      await api.post<Torre>('/torres', {
        nome,
      });

      setNome('');
      setMensagem('Torre cadastrada com sucesso.');
      await carregarTorres();
    } catch (error: any) {
      const mensagemApi = error?.response?.data?.mensagem || error?.response?.data?.message;
      setErro(mensagemApi || 'Erro ao cadastrar torre.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarTorres();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Torres</h1>
          <p>Cadastre e consulte as torres do condomínio.</p>
        </div>
      </div>

      <section className="panel">
        <h2>Nova torre</h2>

        <form className="form" onSubmit={cadastrarTorre}>
          <div className="form-group">
            <label htmlFor="nome">Nome da torre</label>
            <input
              id="nome"
              type="text"
              placeholder="Ex: Prime"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Cadastrar torre'}
          </button>
        </form>

        {mensagem && <div className="alert success">{mensagem}</div>}
        {erro && <div className="alert error">{erro}</div>}
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>Torres cadastradas</h2>
          <button className="secondary" onClick={carregarTorres}>
            Atualizar
          </button>
        </div>

        {torres.length === 0 ? (
          <p className="empty">Nenhuma torre cadastrada.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {torres.map((torre) => (
                <tr key={torre.id}>
                  <td>{torre.id}</td>
                  <td>{torre.nome}</td>
                  <td>
                    <span className={torre.ativa ? 'badge active' : 'badge inactive'}>
                      {torre.ativa ? 'Ativa' : 'Inativa'}
                    </span>
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
