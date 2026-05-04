const API_BASE = 'http://localhost:8080/api';

const App = {
    state: {
        vehiculos: [],
        ordenes: [],
        loading: false
    },

    init() {
        this.cargarDatosIniciales();
        this.configurarEventListeners();
    },

    async cargarDatosIniciales() {
        this.mostrarLoading(true);
        try {
            await Promise.all([
                this.cargarVehiculos(),
                this.cargarOrdenes()
            ]);
            this.actualizarEstadisticas();
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            this.mostrarLoading(false);
        }
    },

    async cargarVehiculos() {
        try {
            const response = await fetch(`${API_BASE}/vehiculos`);
            if (response.ok) {
                const data = await response.json();
                this.state.vehiculos = data;
            }
        } catch (error) {
            console.error('Error fetching vehículos:', error);
            this.state.vehiculos = [];
        }
    },

    async cargarOrdenes() {
        try {
            const response = await fetch(`${API_BASE}/ordenes`);
            if (response.ok) {
                const data = await response.json();
                this.state.ordenes = data;
            }
        } catch (error) {
            console.error('Error fetching órdenes:', error);
            this.state.ordenes = [];
        }
    },

    actualizarEstadisticas() {
        const vehiculos = this.state.vehiculos.length;
        const ordenesHoy = this.contarOrdenesHoy();
        const enRuta = this.state.vehiculos.filter(v => v.estado === 'EN_RUTA').length;
        const mantenimiento = this.state.vehiculos.filter(v => v.estado === 'MANTENIMIENTO').length;

        this.animarNumero('stat-vehiculos', vehiculos);
        this.animarNumero('stat-ordenes', ordenesHoy);
        this.animarNumero('stat-enruta', enRuta);
        this.animarNumero('stat-mantenimiento', mantenimiento);
    },

    contarOrdenesHoy() {
        const hoy = new Date().toDateString();
        return this.state.ordenes.filter(o => {
            const fecha = new Date(o.fechaCreacion).toDateString();
            return fecha === hoy;
        }).length;
    },

    animarNumero(elementId, valorFinal) {
        const elemento = document.getElementById(elementId);
        if (!elemento) return;

        const duracion = 1000;
        const paso = Math.ceil(valorFinal / (duracion / 16));
        let valorActual = 0;

        const intervalo = setInterval(() => {
            valorActual += paso;
            if (valorActual >= valorFinal) {
                valorActual = valorFinal;
                clearInterval(intervalo);
            }
            elemento.textContent = valorActual;
        }, 16);
    },

    configurarEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const seccion = e.currentTarget.dataset.section;
                this.navegar(seccion);
            });
        });

        document.querySelectorAll('.action-card').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const accion = e.currentTarget.dataset.action;
                this.ejecutarAccion(accion);
            });
        });
    },

    navegar(seccion) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${seccion}"]`)?.classList.add('active');
        console.log(`Navegando a: ${seccion}`);
    },

    ejecutarAccion(accion) {
        console.log(`Acción: ${accion}`);
        alert(`Función "${accion}" en desarrollo`);
    },

    mostrarLoading(show) {
        this.state.loading = show;
    },

    obtenerVehiculos() {
        return this.state.vehiculos;
    },

    obtenerOrdenes() {
        return this.state.ordenes;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});