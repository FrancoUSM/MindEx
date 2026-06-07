package com.bd.mindexa.services.usuario.paciente;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.models.usuario.paciente.AlertasRiesgo;
import com.bd.mindexa.models.usuario.paciente.Notificaciones;
import com.bd.mindexa.models.usuario.paciente.Notificaciones.Categoria;
import com.bd.mindexa.models.usuario.paciente.Notificaciones.EstadoEnvio;
import com.bd.mindexa.repository.notificacion.RepositorioNotificacion;
import com.bd.mindexa.repository.usuario.RepositorioUsuario;
import com.bd.mindexa.repository.usuario.paciente.RepositorioAlertasRiesgo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioNotificacion {

    private final RepositorioUsuario repositorioUsuario;
    private final RepositorioAlertasRiesgo repositorioAlertasRiesgo;
    private final RepositorioNotificacion repositorioNotificacion;

    public Notificaciones crearNotificacionSimple(int id_usuario, String contenido, Notificaciones.Categoria categoria) {
        Usuario usuario = repositorioUsuario.findById(id_usuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Notificaciones n = new Notificaciones();
        n.setUsuario(usuario);
        n.setContenido_notificacion(contenido);
        n.setCategoria(categoria);
        n.setFecha_notificacion(LocalDate.now());
        n.setCreado_en(LocalDateTime.now());
        n.setEstado_envio(EstadoEnvio.ESPERANDO);
        return repositorioNotificacion.save(n);
    }

    public List<Notificaciones> getNotificacionesPendientes(int id_usuario) {
        return repositorioNotificacion.findPendientesByUsuario(id_usuario, EstadoEnvio.DESECHADO);
    }

    public void marcarLeida(int id_notificacion) {
        repositorioNotificacion.findById(id_notificacion).ifPresent(n -> {
            n.setEstado_envio(EstadoEnvio.DESECHADO);
            repositorioNotificacion.save(n);
        });
    }

    public Notificaciones crearNotificaciones(int id_usuario, int id_alertas_riesgo, String contenido_notificacion, String categoria, String estado_envio){
        Notificaciones notificaciones = new Notificaciones();

        AlertasRiesgo alertasRiesgo = repositorioAlertasRiesgo.findById(id_alertas_riesgo).
            orElseThrow(() -> new RuntimeException("Alertas de riesgo del paciente no encontrado"));

        Usuario usuario = repositorioUsuario.findById(id_usuario).
            orElseThrow(() -> new RuntimeException("Usuario no encontrado"));


        notificaciones.setAlertasRiesgo(alertasRiesgo);
        notificaciones.setUsuario(usuario);
        notificaciones.setContenido_notificacion(contenido_notificacion);
        notificaciones.setCategoria(Categoria.valueOf(categoria));
        notificaciones.setFecha_notificacion(LocalDate.now());
        notificaciones.setEnviado_en(LocalDateTime.now());
        notificaciones.setEstado_envio(EstadoEnvio.valueOf(estado_envio));

        return repositorioNotificacion.save(notificaciones);
    }

}
