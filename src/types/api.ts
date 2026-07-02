export type TipoMedidor = 'PRINCIPAL' | 'SECUNDARIO';

export interface Torre {
  id: number;
  nome: string;
  ativa: boolean;
}

export interface Medidor {
  id: number;
  nome: string;
  codigo: string;
  tipo: TipoMedidor;
  torreId: number | null;
  ativo: boolean;
}

export interface Leitura {
  id: number;
  medidorId: number;
  mesReferencia: string;
  dataLeitura: string;
  leituraAnterior: number;
  leituraAtual: number;
  consumo: number;
}

export interface ContaMensal {
  id: number;
  mesReferencia: string;
  valorTotal: number;
  consumoInformado: number;
  dataVencimento: string;
  numeroFatura: string | null;
  observacoes: string | null;
}

export interface ItemRateio {
  id: number;
  torreId: number;
  nomeTorre: string;
  medidorId: number;
  consumo: number;
  percentual: number;
  valorRateado: number;
}

export interface Rateio {
  id: number;
  mesReferencia: string;
  contaMensalId: number;
  valorTotalConta: number;
  consumoTotalSecundario: number;
  consumoMedidorPrincipal: number;
  diferencaConsumo: number;
  dataCalculo: string;
  itens: ItemRateio[];
}
