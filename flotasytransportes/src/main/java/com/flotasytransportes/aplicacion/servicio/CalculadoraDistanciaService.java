package com.flotasytransportes.aplicacion.servicio;

import org.springframework.stereotype.Service;

@Service
public class CalculadoraDistanciaService {

	private static final double RADIO_TIERRA_KM = 6371;

	public double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {

		double dLat = Math.toRadians(lat2 - lat1);
		double dLon = Math.toRadians(lon2 - lon1);

		double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(lat1))
				* Math.cos(Math.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

		double c = 2 * Math.asin(Math.sqrt(a));

		return RADIO_TIERRA_KM * c;
	}
	
}
