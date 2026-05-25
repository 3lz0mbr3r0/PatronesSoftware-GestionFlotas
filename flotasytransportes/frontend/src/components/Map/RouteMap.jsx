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

const BASE_LAT = 4.7110
const BASE_LNG = -74.0721

const coordValida = (v) => v != null && !isNaN(v)

const PUNTOS_BOGOTA = [
  [4.6912, -74.1460], [4.6980, -74.1050], [4.6150, -74.0750],
  [4.6450, -74.0630], [4.6750, -74.0540], [4.7050, -74.0470],
  [4.6030, -74.0920], [4.6330, -74.0900], [4.6610, -74.1000],
  [4.6830, -74.0770], [4.7130, -74.0610], [4.7340, -74.0520],
  [4.6270, -74.1230], [4.6550, -74.1150], [4.6400, -74.0680],
  [4.6680, -74.0830], [4.6940, -74.0940], [4.7250, -74.0390],
  [4.7490, -74.0320], [4.7600, -74.0470], [4.6420, -74.1280],
  [4.6700, -74.1350], [4.6100, -74.0820], [4.6900, -74.0700],
  [4.6720, -74.0480], [4.6470, -74.1130], [4.7180, -74.0720],
  [4.6040, -74.0690], [4.7430, -74.0580], [4.6310, -74.1000],
]

const hashIndex = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % PUNTOS_BOGOTA.length
}

const puntoMock = (id) => PUNTOS_BOGOTA[hashIndex(id || 'x')]

const coloresRuta = ['#00d4aa', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6', '#f97316']

export default function RouteMap({ vehiculos = [], ordenes = [] }) {
  const vehiculosConCoords = vehiculos.map(v => {
    const [lat, lng] = v.latitud != null && !isNaN(v.latitud) && v.longitud != null && !isNaN(v.longitud)
      ? [v.latitud, v.longitud]
      : puntoMock(v.placa)
    return { ...v, _coordMock: lat !== v.latitud, latitud: lat, longitud: lng }
  })

  const ordenesConRuta = ordenes.map(o => {
    const [ol, on] = coordValida(o.origenLat) && coordValida(o.origenLng)
      ? [o.origenLat, o.origenLng]
      : puntoMock(o.codigoOrden || 'o')
    const [dl, dn] = coordValida(o.destinoLat) && coordValida(o.destinoLng)
      ? [o.destinoLat, o.destinoLng]
      : puntoMock((o.codigoOrden || 'o') + '_dst')
    return {
      ...o,
      _rutaMock: ol !== o.origenLat || dl !== o.destinoLat,
      origenLat: ol, origenLng: on,
      destinoLat: dl, destinoLng: dn
    }
  })

  const colorPorVehiculo = {}
  let idxColor = 0
  ordenesConRuta.forEach(o => {
    if (!colorPorVehiculo[o.vehiculoPlaca]) {
      colorPorVehiculo[o.vehiculoPlaca] = coloresRuta[idxColor % coloresRuta.length]
      idxColor++
    }
  })

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
        center={[BASE_LAT, BASE_LNG]}
        zoom={10}
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
              {v._coordMock && <><br /><em style={{fontSize:'0.75rem',color:'#888'}}>Ubicación simulada</em></>}
            </Popup>
          </Marker>
        ))}

        {ordenesConRuta.map((o, i) => (
          <Polyline
            key={`ruta-${o.codigoOrden || i}`}
            positions={[[o.origenLat, o.origenLng], [o.destinoLat, o.destinoLng]]}
            pathOptions={{
              color: colorPorVehiculo[o.vehiculoPlaca] || '#00d4aa',
              weight: 2.5,
              opacity: 0.7,
              dashArray: '8, 8'
            }}
          >
            <Popup>
              <strong>Orden: {o.codigoOrden}</strong><br />
              {o.vehiculoPlaca && <>Vehículo: {o.vehiculoPlaca}<br /></>}
              {o.origenLat?.toFixed(4)},{o.origenLng?.toFixed(4)} → {o.destinoLat?.toFixed(4)},{o.destinoLng?.toFixed(4)}<br />
              {o.cargaDescripcion && <>Carga: {o.cargaDescripcion}<br /></>}
              {o._rutaMock && <em style={{fontSize:'0.75rem',color:'#888'}}>Ruta simulada</em>}
            </Popup>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  )
}
