import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './components/Dashboard/Dashboard'
import ListaOrdenes from './components/Ordenes/ListaOrdenes'
import ListaVehiculos from './components/Vehiculos/ListaVehiculos'
import Reportes from './components/Reportes/Reportes'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="ordenes" element={<ListaOrdenes />} />
        <Route path="vehiculos" element={<ListaVehiculos />} />
        <Route path="reportes" element={<Reportes />} />
      </Route>
    </Routes>
  )
}

export default App