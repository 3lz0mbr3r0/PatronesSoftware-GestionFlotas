import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Dashboard from './components/Dashboard/Dashboard'
import ListaOrdenes from './components/Ordenes/ListaOrdenes'
import ListaVehiculos from './components/Vehiculos/ListaVehiculos'
import Reportes from './components/Reportes/Reportes'
import HistorialRutas from './components/Rutas/HistorialRutas'
import Analytics from './components/Analytics/Analytics'
import HistorialVehiculo from './components/HistorialVehiculo/HistorialVehiculo'
import CalendarioMantenimiento from './components/CalendarioMantenimiento/CalendarioMantenimiento'
import Comparador from './components/Comparador/Comparador'
import GenerarReporte from './components/GenerarReporte/GenerarReporte'
import CommandPanel from './components/Command/CommandPanel'
import ToastContainer from './components/Toast/ToastContainer'

function App() {
  const location = useLocation()
  const showDashboard = location.pathname === '/'

  return (
    <ThemeProvider>
      <div className="background-pattern"></div>
      <Header />
      <main className="main">
        <div style={{ display: showDashboard ? 'block' : 'none' }}>
          <Dashboard />
        </div>
        {!showDashboard && (
          <Routes>
            <Route path="/ordenes" element={<ListaOrdenes />} />
            <Route path="/vehiculos" element={<ListaVehiculos />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/rutas" element={<HistorialRutas />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/historial-vehiculo" element={<HistorialVehiculo />} />
            <Route path="/calendario-mantenimiento" element={<CalendarioMantenimiento />} />
            <Route path="/comparador" element={<Comparador />} />
            <Route path="/generar-reporte" element={<GenerarReporte />} />
          </Routes>
        )}
      </main>
      <Footer />
      <ToastContainer />
      <CommandPanel />
    </ThemeProvider>
  )
}

export default App
