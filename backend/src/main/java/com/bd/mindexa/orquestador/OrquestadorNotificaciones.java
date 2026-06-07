package com.bd.mindexa.orquestador;

import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.models.usuario.paciente.AlertasRiesgo;
import com.bd.mindexa.models.usuario.paciente.AnalisisRiesgo;
import com.bd.mindexa.models.usuario.paciente.Notificaciones;
import com.bd.mindexa.services.usuario.ServicioUsuario;
import com.bd.mindexa.services.usuario.paciente.ServicioNotificacion;
import com.bd.mindexa.services.usuario.paciente.analisis.ServicioAlertasRiesgo;
import com.bd.mindexa.services.usuario.paciente.analisis.ServicioAnalisisRiesgo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class OrquestadorNotificaciones {

    private final ServicioUsuario servicioUsuario;
    private final ServicioNotificacion servicioNotificacion;
    private final ServicioAnalisisRiesgo servicioAnalisisRiesgo;
    private final ServicioAlertasRiesgo servicioAlertasRiesgo;

    @Transactional
    public Notificaciones generarNotificacionesRiesgo(int id_usuario, String contenido_analisis, String contenido_notificacion, String contenido_alerta, String estado_riesgo, LocalDate fecha_analisis, String mensaje_notificacion, String categoria, LocalDate fecha_notificacion, String estado_envio) {
        //Obtener usuario
        Usuario usuario = servicioUsuario.getUsuarioById(id_usuario);
        //Analizar riesgo del usuario
        AnalisisRiesgo analisisRiesgo = servicioAnalisisRiesgo.crearAnalisisRiesgo(id_usuario, contenido_analisis, estado_riesgo, fecha_analisis);

        //Generar alertas de riesgo
        AlertasRiesgo alertaRiesgo = servicioAlertasRiesgo.crearAlertasRiesgo(analisisRiesgo.getId_analisis_riesgo(), contenido_alerta);

         Notificaciones notificacion = servicioNotificacion.crearNotificaciones(usuario.getIdUsuario(), alertaRiesgo.getId_alerta_riesgo(), contenido_notificacion, categoria, estado_envio );

        return notificacion;

    }

}
