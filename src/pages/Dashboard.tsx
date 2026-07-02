export function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral do sistema de rateio de gás condominial.</p>
        </div>
      </div>

      <div className="cards-grid">
        <div className="card">
          <span className="card-label">Fluxo do sistema</span>
          <h2>1</h2>
          <p>Cadastre torres, medidores, leituras, conta mensal e calcule o rateio.</p>
        </div>

        <div className="card">
          <span className="card-label">Regra principal</span>
          <h2>%</h2>
          <p>O valor da conta é dividido proporcionalmente pelo consumo dos medidores secundários.</p>
        </div>

        <div className="card">
          <span className="card-label">Backend</span>
          <h2>API</h2>
          <p>Java, Spring Boot, PostgreSQL, Flyway, Docker e testes automatizados.</p>
        </div>
      </div>

      <section className="panel">
        <h2>Como usar</h2>
        <ol className="steps">
          <li>Cadastre as torres Prime e Hype.</li>
          <li>Cadastre o medidor principal e os medidores secundários.</li>
          <li>Registre as leituras mensais dos medidores.</li>
          <li>Cadastre a conta mensal da concessionária.</li>
          <li>Calcule e consulte o rateio do mês.</li>
        </ol>
      </section>
    </div>
  );
}
