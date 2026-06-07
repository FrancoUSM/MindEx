package com.bd.mindexa.services.checkin;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bd.mindexa.dto.registros.DTOCheckinHistorialResponse;
import com.bd.mindexa.dto.registros.DTOCheckinIDSM;
import com.bd.mindexa.models.usuario.Paciente;
import com.bd.mindexa.models.usuario.Usuario;
import com.bd.mindexa.models.usuario.paciente.AnalisisRiesgo;
import com.bd.mindexa.models.usuario.paciente.HistorialPaciente;
import com.bd.mindexa.repository.usuario.RepositorioPaciente;
import com.bd.mindexa.repository.usuario.RepositorioUsuario;
import com.bd.mindexa.repository.usuario.paciente.RepositorioAnalisisRiesgo;
import com.bd.mindexa.repository.usuario.paciente.RepositorioHistorialPaciente;
import com.bd.mindexa.models.usuario.paciente.Notificaciones;
import com.bd.mindexa.services.usuario.ServicioPaciente;
import com.bd.mindexa.services.usuario.paciente.ServicioNotificacion;
import com.bd.mindexa.services.usuario.paciente.analisis.ServicioAnalisisRiesgo;
import com.bd.mindexa.services.usuario.paciente.historial.ServicioHistorialPaciente;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioCheckinIDSM {

    private final RepositorioUsuario repositorioUsuario;
    private final RepositorioPaciente repositorioPaciente;
    private final RepositorioHistorialPaciente repositorioHistorialPaciente;
    private final RepositorioAnalisisRiesgo repositorioAnalisisRiesgo;
    private final ServicioPaciente servicioPaciente;
    private final ServicioHistorialPaciente servicioHistorialPaciente;
    private final ServicioAnalisisRiesgo servicioAnalisisRiesgo;
    private final ServicioNotificacion servicioNotificacion;

    @Transactional
    public AnalisisRiesgo guardarCheckin(DTOCheckinIDSM dto) {
        Usuario usuario = repositorioUsuario.findById(dto.id_usuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Paciente paciente = repositorioPaciente.findByUsuario(usuario)
                .orElseGet(() -> servicioPaciente.crearPaciente(dto.id_usuario));

        HistorialPaciente historial = repositorioHistorialPaciente.findByPaciente(paciente)
                .orElseGet(() -> servicioHistorialPaciente.crearHistorialPaciente(paciente.getId_paciente()));

        // Algoritmo IDSM-Plus
        int p1 = dto.claridad_mental, p2 = dto.estres_dificultad, p3 = dto.poca_energia;
        int p4 = dto.somnolencia, p5 = dto.irritabilidad, p6 = dto.mente_sobrecargada;
        int p7 = dto.manejo_emociones, p8 = dto.apoyo_equipo;

        int id = p2 + p3 + p4 + p5 + p6;
        int ir = (7 - p1) + (7 - p7) + (7 - p8);
        int rhi = id + ir;

        String colorBase;
        if (rhi <= 22) colorBase = "verde";
        else if (rhi <= 30) colorBase = "amarillo";
        else if (rhi <= 38) colorBase = "naranja";
        else colorBase = "rojo";

        boolean flagConvergencia = p2 >= 5 && p4 >= 5;
        boolean flagSomnolencia = p4 >= 5;
        boolean flagEstres = p2 >= 5 && p7 <= 2;

        String colorFinal = colorBase;
        if (flagConvergencia) {
            colorFinal = "rojo";
        } else if (flagSomnolencia && (colorBase.equals("verde") || colorBase.equals("amarillo"))) {
            colorFinal = "naranja";
        }

        String estadoRiesgo = switch (colorFinal) {
            case "rojo" -> "RIESGO_ALTO";
            case "naranja" -> "RIESGO_MEDIANO";
            default -> "RIESGO_BAJO";
        };

        log.info("Checkin IDSM usuario={} RHI={} ID={} IR={} color={}", dto.id_usuario, rhi, id, ir, colorFinal);

        AnalisisRiesgo analisis = new AnalisisRiesgo();
        analisis.setHistorialPaciente(historial);
        analisis.setContenido_analisis(String.format("IDSM-Plus RHI=%d color=%s flags=[conv:%b,somn:%b,estres:%b]",
                rhi, colorFinal, flagConvergencia, flagSomnolencia, flagEstres));
        analisis.setEstado_riesgo(AnalisisRiesgo.EstadoRiesgo.valueOf(estadoRiesgo));
        analisis.setP1(p1); analisis.setP2(p2); analisis.setP3(p3); analisis.setP4(p4);
        analisis.setP5(p5); analisis.setP6(p6); analisis.setP7(p7); analisis.setP8(p8);
        analisis.setId_score(id);
        analisis.setIr_score(ir);
        analisis.setRhi_score(rhi);
        analisis.setColor_base(colorBase);
        analisis.setColor_final(colorFinal);
        analisis.setFlag_convergencia_critica(flagConvergencia);
        analisis.setFlag_somnolencia_critica(flagSomnolencia);
        analisis.setFlag_estres_desregulado(flagEstres);
        analisis.setCreado_en(java.time.LocalDateTime.now());
        analisis.setActualizado_en(java.time.LocalDateTime.now());
        AnalisisRiesgo saved = repositorioAnalisisRiesgo.save(analisis);

        if ("RIESGO_ALTO".equals(estadoRiesgo)) {
            try {
                servicioNotificacion.crearNotificacionSimple(dto.id_usuario,
                        "⚠️ Tu nivel de estrés alcanzó zona crítica (RHI=" + rhi + "). Te recomendamos hablar con un profesional.",
                        Notificaciones.Categoria.ALERTA);
            } catch (Exception e) {
                log.warn("No se pudo crear notificación automática: {}", e.getMessage());
            }
        }
        return saved;
    }

    @Transactional
    public AnalisisRiesgo guardarEvaluacion(int id_usuario, String tipo, int score, int max_score, String severidad) {
        Usuario usuario = repositorioUsuario.findById(id_usuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Paciente paciente = repositorioPaciente.findByUsuario(usuario)
                .orElseGet(() -> servicioPaciente.crearPaciente(id_usuario));

        HistorialPaciente historial = repositorioHistorialPaciente.findByPaciente(paciente)
                .orElseGet(() -> servicioHistorialPaciente.crearHistorialPaciente(paciente.getId_paciente()));

        String contenido = String.format("%s score=%d/%d severidad=%s", tipo, score, max_score, severidad);
        String estadoRiesgo = mapSeveridad(severidad);

        log.info("Guardando evaluación {} para usuario {} — score={} nivel={}", tipo, id_usuario, score, estadoRiesgo);

        return servicioAnalisisRiesgo.crearAnalisisRiesgo(
                historial.getId_historial_paciente(), contenido, estadoRiesgo, LocalDate.now());
    }

    private String mapSeveridad(String severidad) {
        return switch (severidad) {
            case "Severa", "Moderadamente severa" -> "RIESGO_ALTO";
            case "Moderada" -> "RIESGO_MEDIANO";
            default -> "RIESGO_BAJO";
        };
    }

    public List<DTOCheckinHistorialResponse> getHistorial(int id_usuario) {
        return repositorioAnalisisRiesgo.findByIdUsuario(id_usuario)
                .stream()
                .map(DTOCheckinHistorialResponse::new)
                .toList();
    }

    private String mapResultLevel(String level) {
        return switch (level) {
            case "red" -> "RIESGO_ALTO";
            case "orange" -> "RIESGO_MEDIANO";
            default -> "RIESGO_BAJO";
        };
    }
}
