export function extrairMensagemErro(error: unknown, mensagemPadrao: string) {
  const erroApi = error as {
    response?: {
      data?: unknown;
    };
  };

  const data = erroApi.response?.data;

  if (typeof data === 'string') {
    return data;
  }

  if (data && typeof data === 'object') {
    const body = data as Record<string, unknown>;

    const camposPossiveis = [
      'mensagem',
      'message',
      'erro',
      'error',
      'detail',
      'details',
      'descricao',
    ];

    for (const campo of camposPossiveis) {
      const valor = body[campo];

      if (typeof valor === 'string' && valor.trim()) {
        return valor;
      }
    }
  }

  return mensagemPadrao;
}
