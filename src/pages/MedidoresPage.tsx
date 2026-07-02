import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../services/api';
import type { Medidor, TipoMedidor, Torre } from '../types/api';

export function MedidoresPage() {
  const [medidores, setMedidores] = useState<Medidor[]>([]);
  const [torres, setTorres] = useState<Torre[]>([]);

  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [tipo, setTipo] = useState<TipoMedidor>('PRINCIPAL');
  const [torreId, setTorreId] = useState('');

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function carregarMedidores() {
    try {
      setErro('');
      const response = await api.get<Medidor[]>('/medidores');
      setMedidores(response.data);
    } catch {
      setErro('Não foi possível carregar os medidores. Verifique se a API está rodando.');
    }
  }

  async function carregarTorres() {
    try {
      const response = await api.get<Torre[]>('/torres');
      setTorres(response.data);
    } catch {
      setErro('Não foi possível carregar as torres.');
    }
  }

  async function cadastrarMedidor(event: FormEvent) {
    event.preventDefault();

    if (!nome.trim()) {
      setErro('Informe o nome do medidor.');
      return;
    }

    if (!codigo.trim()) {
      setErro('Informe o código do medidor.');
      return;
    }

    if (tipo === 'SECUNDARIO' && !torreId) {
      setErro('Selecione a torre do medidor secundário.');
      return;
    }

    try {
      setLoading(true);
      setErro('');
      setMensagem('');

      await api.post<Medidor>('/medidores', {
        nome,
        codigo,
        tipo,
        torreId: tipo === 'SECUNDARIO' ? Number(torreId) : null,
      });

      setNome('');
      setCodigo('');
      setTipo('PRINCIPAL');
      setTorreId('');

      setMensagem('Medidor cadastrado com sucesso.');
      await carregarMedidores();
    } catch (error: any) {
      const mensagemApi = error?.response?.data?.mensagem || error?.response?.data?.message;
      setErro(mensagemApi || 'Erro ao cadastrar medidor.');
    } finally {
      setLoading(false);
    }
  }

  function obterNomeTorre(id: number | null) {
    if (id === null) {
      return '-';
    }

    const torre = torres.find((item) => item.id === id);
    return torre ? torre.nome : `ID ${id}`;
  }

  useEffect(() => {
    carregarTorres();
    carregarMedidores();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Medidores</h1>
          <p>Cadastro e consulta dos medidores principal e secundários.</p>
        </div>
      </div>

      <section className="panel">
        <h2>Novo medidor</h2>

        <form className="form" onSubmit={cadastrarMedidor}>
          <div className="form-group">
            <label htmlFor="nome">Nome do medidor</label>
            <input
              id="nome"
              type="text"
              placeholder="Ex: Medidor Torre Prime"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="codigo">Código do medidor</label>
            <input
              id="codigo"
              type="text"
              placeholder="Ex: GAS-PRIME-001"
              value={codigo}
              onChange={(event) => setCodigo(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo do medidor</label>
            <select
              id="tipo"
              value={tipo}
              onChange={(event) => {
                const novoTipo = event.target.value as TipoMedidor;
                setTipo(novoTipo);

                if (novoTipo === 'PRINCIPAL') {
                  setTorreId('');
                }
              }}
            >
              <option value="PRINCIPAL">Principal</option>
              <option value="SECUNDARIO">Secundário</option>
            </select>
          </div>

          {tipo === 'SECUNDARIO' && (
            <div className="form-group">
              <label htmlFor="torreId">Torre</label>
              <select
                id="torreId"
                value={torreId}
                onChange={(event) => setTorreId(event.target.value)}
              >
                <option value="">Selecione uma torre</option>
                {torres.map((torre) => (
                  <option key={torre.id} value={torre.id}>
                    {torre.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Cadastrar medidor'}
          </button>
        </form>

        {mensagem && <div className="alert success">{mensagem}</div>}
        {erro && <div className="alert error">{erro}</div>}
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>Medidores cadastrados</h2>
          <button className="secondary" onClick={carregarMedidores}>
            Atualizar
          </button>
        </div>

        {medidores.length === 0 ? (
          <p className="empty">Nenhum medidor cadastrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Código</th>
                <th>Tipo</th>
                <th>Torre</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {medidores.map((medidor) => (
                <tr key={medidor.id}>
                  <td>{medidor.id}</td>
                  <td>{medidor.nome}</td>
                  <td>{medidor.codigo}</td>
                  <td>
                    <span className={medidor.tipo === 'PRINCIPAL' ? 'badge info' : 'badge active'}>
                      {medidor.tipo === 'PRINCIPAL' ? 'Principal' : 'Secundário'}
                    </span>
                  </td>
                  <td>{obterNomeTorre(medidor.torreId)}</td>
                  <td>
                    <span className={medidor.ativo ? 'badge active' : 'badge inactive'}>
                      {medidor.ativo ? 'Ativo' : 'Inativo'}
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
