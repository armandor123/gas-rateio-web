# GasRateio Web

Frontend do **Sistema de Rateio de Gás Condominial**, desenvolvido em React com TypeScript.

Este projeto faz parte de uma aplicação full stack criada para resolver um problema real de condomínio: dividir corretamente o valor da conta de gás entre duas torres com base no consumo registrado por medidores secundários.

---

## Sobre o projeto

O condomínio possui:

- 1 medidor principal de gás, usado pela concessionária para gerar a conta total;
- 2 medidores secundários, um para cada torre;
- uma necessidade de dividir o valor total da conta proporcionalmente ao consumo de cada torre.

O frontend permite cadastrar dados, consultar informações, calcular rateios e visualizar análises gráficas do consumo e dos gastos mensais.

---

## Funcionalidades

- Dashboard inicial do sistema
- Cadastro e listagem de torres
- Cadastro e listagem de medidores
- Registro e listagem de leituras mensais
- Cadastro e listagem de contas mensais
- Cálculo de rateio por mês
- Busca de rateio por mês
- Visualização detalhada dos valores rateados por torre
- Página de análises com gráficos
- Tratamento de erros vindos da API
- Integração com backend Spring Boot
- Interface responsiva com CSS próprio

---

## Telas principais

### Torres

Permite visualizar e cadastrar as torres do condomínio.

### Medidores

Permite cadastrar medidores principais e secundários, vinculando os secundários às torres correspondentes.

### Leituras

Permite registrar leituras mensais dos medidores. O consumo é calculado com base na diferença entre leitura atual e leitura anterior.

### Contas Mensais

Permite cadastrar a conta mensal de gás, informando valor total, consumo informado, vencimento, número da fatura e observações.

### Rateios

Permite calcular o rateio mensal e consultar rateios já calculados.

### Análises

Exibe gráficos para acompanhamento de:

- evolução do valor da conta;
- consumo principal versus consumo secundário;
- consumo por torre;
- divisão financeira do último rateio.

---

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- Axios
- React Router DOM
- Recharts
- HTML
- CSS
- Git e GitHub

---

## Requisitos

Antes de rodar o projeto, é necessário ter instalado:

- Node.js
- npm
- Git

Também é necessário que a API backend esteja rodando.

Repositório da API:

```text
gas-rateio-api
```

Por padrão, o frontend espera a API em:

```text
http://localhost:8080
```

---

## Como rodar localmente

Clone o repositório:

```bash
git clone https://github.com/armandorodrigues/gas-rateio-web.git
```

Entre na pasta:

```bash
cd gas-rateio-web
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env.local
```

Rode o projeto:

```bash
npm run dev
```

Acesse no navegador:

```text
http://localhost:5173
```

---

## Configuração da API

O arquivo `.env.local` pode ser usado para configurar a URL da API:

```env
VITE_API_URL=http://localhost:8080
```

Caso a variável não seja informada, o sistema usa automaticamente:

```text
http://localhost:8080
```

---

## Scripts disponíveis

Rodar em desenvolvimento:

```bash
npm run dev
```

Gerar build de produção:

```bash
npm run build
```

Visualizar build localmente:

```bash
npm run preview
```

---

## Estrutura do projeto

```text
src
├── components
│   └── Layout.tsx
├── pages
│   ├── Dashboard.tsx
│   ├── TorresPage.tsx
│   ├── MedidoresPage.tsx
│   ├── LeiturasPage.tsx
│   ├── ContasMensaisPage.tsx
│   ├── RateiosPage.tsx
│   └── AnalisesPage.tsx
├── services
│   └── api.ts
├── types
│   └── api.ts
├── utils
│   └── error.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## Integração com o backend

O frontend consome os seguintes recursos da API:

```text
GET    /torres
POST   /torres

GET    /medidores
POST   /medidores

GET    /leituras
POST   /leituras

GET    /contas-mensais
POST   /contas-mensais

GET    /rateios
GET    /rateios/{mesReferencia}
POST   /rateios/calcular
```

---

## Regras de negócio representadas na interface

- O medidor principal não pertence a uma torre específica.
- Medidores secundários precisam estar vinculados a uma torre.
- O consumo é calculado pela diferença entre leitura atual e leitura anterior.
- O rateio é calculado proporcionalmente ao consumo dos medidores secundários.
- Um mês já calculado não pode ser calculado novamente.
- Caso o envio de e-mail esteja habilitado no backend, o resumo do rateio é enviado após o cálculo.

---

## Aprendizados demonstrados

Este projeto demonstra conhecimentos em:

- Criação de SPA com React
- Componentização
- TypeScript
- Consumo de API REST
- Organização de serviços HTTP com Axios
- Roteamento com React Router
- Formulários controlados
- Tratamento de erros
- Renderização condicional
- Gráficos com Recharts
- Separação de tipos da API
- Organização de layout e CSS
- Integração frontend/backend

---

## Próximas melhorias

- Dockerizar o frontend com Nginx
- Criar pipeline de CI com GitHub Actions
- Melhorar dashboard inicial
- Adicionar autenticação
- Criar tela de configurações do sistema
- Permitir exportação de rateio em PDF
- Adicionar testes automatizados no frontend

---

## Autor

Desenvolvido por **Armando Rodrigues** como projeto de portfólio full stack.

