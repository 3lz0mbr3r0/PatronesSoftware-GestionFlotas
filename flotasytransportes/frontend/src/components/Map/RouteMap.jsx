import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const estadoIcono = (estado) => {
  const colores = {
    DISPONIBLE: '#00d4aa',
    EN_RUTA: '#8b5cf6',
    MANTENIMIENTO: '#f59e0b'
  }
  const color = colores[estado] || '#00d4aa'
  return new L.DivIcon({
    className: '',
    html: `<div style="
      width: 16px; height: 16px;
      background: ${color};
      border: 3px solid ${color}44;
      border-radius: 50%;
      box-shadow: 0 0 8px ${color}66;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10]
  })
}

export default function RouteMap({ vehiculos = [], ordenes = [] }) {
  const posInicial = [4.7110, -74.0721]
  const zoom = 12

  const vehiculosConCoords = vehiculos.filter(v => v.latitud != null && v.longitud != null)
  const ordenesConRuta = ordenes.filter(o =>
    o.origenLat != null && o.origenLng != null &&
    o.destinoLat != null && o.destinoLng != null
  )

  return (
    <div style={{
      width: '100%',
      height: '100%',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      background: 'var(--bg-secondary)'
    }}>
      <MapContainer
        center={posInicial}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehiculosConCoords.map(v => (
          <Marker
            key={v.placa}
            position={[v.latitud, v.longitud]}
            icon={estadoIcono(v.estado)}
          >
            <Popup>
              <strong>{v.placa}</strong><br />
              {v.tipo || 'CAMION'} · {v.tipoEnergia || 'GASOLINA'}<br />
              Estado: {v.estado}<br />
              {v.kilometrajeActual || 0} km
            </Popup>
          </Marker>
        ))}

        {ordenesConRuta.map((o, i) => (
          <Polyline
            key={`ruta-${o.codigoOrden || i}`}
            positions={[[o.origenLat, o.origenLng], [o.destinoLat, o.destinoLng]]}
            pathOptions={{
              color: '#00d4aa',
              weight: 2,
              opacity: 0.6,
              dashArray: '8, 8'
            }}
          />
        ))}
      </MapContainer>
    </div>
  )
}
