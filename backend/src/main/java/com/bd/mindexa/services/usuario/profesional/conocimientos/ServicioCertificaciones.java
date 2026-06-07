package com.bd.mindexa.services.usuario.profesional.conocimientos;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.models.usuario.profesional.Certificaciones;
//import com.bd.mindexa.repository.usuario.RepositorioUsuarioProfesional;
import com.bd.mindexa.repository.usuario.profesional.RepositorioCertificaciones;

import io.micrometer.common.lang.NonNull;

@Service
@Slf4j
@RequiredArgsConstructor

public class ServicioCertificaciones {

    private final RepositorioCertificaciones repositorioCertificaciones;


    public Certificaciones crearCertificaciones(Profesional profesional, String tipo_certificacion, String nombre_certificacion, String institucion_emisora /*, LocalDate fecha_obtencion, LocalDate fecha_expiracion*/){
        Certificaciones certificacion = new Certificaciones();

  

        certificacion.setNombre_certificacion(nombre_certificacion);
        certificacion.setTipo_certificacion(tipo_certificacion);
        /*certificacion.setFecha_obtencion(fecha_obtencion);
        certificacion.setFecha_expiracion(fecha_expiracion);*/
        certificacion.setCreado_en(LocalDateTime.now());
        certificacion.setProfesional(profesional);
        return repositorioCertificaciones.save(certificacion);
    }

    public void actualizarCertificaciones(Certificaciones certificaciones, String tipo_certificacion, String nombre_certificacion, String institucion_emisora){
        if (!nombre_certificacion.equals(certificaciones.getNombre_certificacion())) {
            certificaciones.setNombre_certificacion(nombre_certificacion);
        }
        if (!tipo_certificacion.equals(certificaciones.getTipo_certificacion())) {
            certificaciones.setTipo_certificacion(tipo_certificacion);
        }
        if (!institucion_emisora.equals(certificaciones.getInstitucion_emisora())) {
            certificaciones.setInstitucion_emisora(institucion_emisora);
        }
        certificaciones.setActualizado_en(LocalDateTime.now());
        repositorioCertificaciones.save(certificaciones);
    }

    public void desactivarCertificaciones(Certificaciones certificaciones){
        certificaciones.setDesactivado_en(LocalDateTime.now());
        repositorioCertificaciones.save(certificaciones);
    }

    public void eliminarCertificaciones(@NonNull Certificaciones certificaciones){
        repositorioCertificaciones.delete(certificaciones);
    }

}
