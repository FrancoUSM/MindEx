package com.bd.mindexa.services.atencion;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import com.bd.mindexa.models.atencion.DiaDisponible;
import com.bd.mindexa.models.atencion.DisponibilidadAtencion;
import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.repository.atencion.RepositorioDisponibilidadAtencion;
import com.bd.mindexa.repository.usuario.RepositorioProfesional;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDate;
import java.time.LocalDateTime;

@SuppressWarnings("unused")
@Service
@Slf4j
@RequiredArgsConstructor

public class ServicioDisponibilidadAtencion {

    private final RepositorioDisponibilidadAtencion repositorioDisponibilidadAtencion;
    private final RepositorioProfesional repositorioProfesional;

    public DisponibilidadAtencion crearDisponibilidadAtencion(int id_profesional, LocalDate dia, LocalDateTime hora_inicio, LocalDateTime hora_fin){
        DisponibilidadAtencion disponibilidadAtencion = new DisponibilidadAtencion();

        Profesional profesional = repositorioProfesional.findById(id_profesional).
            orElseThrow(() -> new RuntimeException("Profesional no encontrado"));

        disponibilidadAtencion.setProfesional(profesional);
        disponibilidadAtencion.setDia(dia);
        disponibilidadAtencion.setHora_inicio(hora_inicio);
        disponibilidadAtencion.setHora_fin(hora_fin);
        disponibilidadAtencion.setCreado_en(LocalDateTime.now());
        disponibilidadAtencion.setActualizado_en(LocalDateTime.now());

        return repositorioDisponibilidadAtencion.save(disponibilidadAtencion);

    }

    public List<DisponibilidadAtencion> getAllDisponibilidadAtencion(int id_profesional){ 
        Profesional profesional = repositorioProfesional.findById(id_profesional).
            orElseThrow(() -> new RuntimeException("Profesional no encontrado"));
        return repositorioDisponibilidadAtencion.findByProfesional(profesional);
    }

    public void eliminarDisponibilidadAtencion(int id_disponibilidad_atencion) {
        DisponibilidadAtencion disponibilidadAtencion = repositorioDisponibilidadAtencion.findById(id_disponibilidad_atencion)
            .orElseThrow(() -> new RuntimeException("Disponibilidad de atención no encontrada"));
        repositorioDisponibilidadAtencion.delete(disponibilidadAtencion);
    }

    public DisponibilidadAtencion actualizarDisponibilidadAtencion(int id_disponibilidad_atencion, int id_profesional, LocalDate dia, LocalDateTime hora_inicio, LocalDateTime hora_fin) {
        DisponibilidadAtencion disponibilidadAtencion = repositorioDisponibilidadAtencion.findById(id_disponibilidad_atencion)
            .orElseThrow(() -> new RuntimeException("Disponibilidad de atención no encontrada"));

        Profesional profesional = repositorioProfesional.findById(id_profesional)
            .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));

        disponibilidadAtencion.setProfesional(profesional);
        disponibilidadAtencion.setDia(dia);
        disponibilidadAtencion.setHora_inicio(hora_inicio);
        disponibilidadAtencion.setHora_fin(hora_fin);
        disponibilidadAtencion.setActualizado_en(LocalDateTime.now());

        return repositorioDisponibilidadAtencion.save(disponibilidadAtencion);
}

}

