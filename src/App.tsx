import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TorresPage } from './pages/TorresPage';
import { MedidoresPage } from './pages/MedidoresPage';
import { LeiturasPage } from './pages/LeiturasPage';
import { ContasMensaisPage } from './pages/ContasMensaisPage';
import { RateiosPage } from './pages/RateiosPage';
import { AnalisesPage } from './pages/AnalisesPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="torres" element={<TorresPage />} />
        <Route path="medidores" element={<MedidoresPage />} />
        <Route path="leituras" element={<LeiturasPage />} />
        <Route path="contas-mensais" element={<ContasMensaisPage />} />
        <Route path="rateios" element={<RateiosPage />} />
        <Route path="analises" element={<AnalisesPage />} />
      </Route>
    </Routes>
  );
}
