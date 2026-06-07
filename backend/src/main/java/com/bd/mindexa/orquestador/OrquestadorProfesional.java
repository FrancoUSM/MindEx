package com.bd.mindexa.orquestador;
import org.springframework.stereotype.Service;

import com.bd.mindexa.dto.registros.DTORegistroCertificacionesProfesionales;
import com.bd.mindexa.dto.registros.DTORegistroServicioProfesional;
import com.bd.mindexa.dto.registros.DTORegistroUsuarioProfesionalRequest;
import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.models.usuario.profesional.Certificaciones;
import com.bd.mindexa.models.usuario.profesional.EnfoqueTerapeuticoPrincipal;
import com.bd.mindexa.models.usuario.profesional.ServicioProfesional;
import com.bd.mindexa.services.usuario.profesional.ServicioServicioProfesional;
import com.bd.mindexa.services.usuario.profesional.conocimientos.ServicioCertificaciones;
import com.bd.mindexa.services.usuario.profesional.conocimientos.ServicioEnfoqueTerapeuticoPrincipal;
import com.bd.mindexa.services.usuario.profesional.conocimientos.ServicioEspecialidadProfesional;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrquestadorProfesional {

    private final com.bd.mindexa.services.usuario.ServicioProfesional servicioProfesional; //HAY OTRA CLASE CON EL MISMO NOMBRE
    private final ServicioCertificaciones servicioCertificaciones;
    private final ServicioEspecialidadProfesional servicioEspecialidad;
    private final ServicioServicioProfesional servicioServicioProfesional;
    private final ServicioEnfoqueTerapeuticoPrincipal servicioEnfoqueTerapeuticoPrincipal;
    


    @Transactional
    public void registroCompleto(DTORegistroUsuarioProfesionalRequest request, DTORegistroCertificacionesProfesionales certificacion, DTORegistroServicioProfesional servicio) {

        //PROFESIONAL
        Profesional profesional = servicioProfesional.registrarProfesional(request);
        System.out.println(profesional);
        EnfoqueTerapeuticoPrincipal enfoqueTerapeutico = servicioEnfoqueTerapeuticoPrincipal.crearEnfoqueTerapeuticoPrincipal(profesional, request.enfoque_terapeutico);

            System.out.println(enfoqueTerapeutico);
        if(request.especialidades != null){
            request.especialidades.forEach(nombre_especialidad -> servicioEspecialidad.crearEspecialidadProfesional(profesional, nombre_especialidad));
        }

        if(certificacion != null && certificacion.nombre_certificacion != null){
            @SuppressWarnings("unused")
            Certificaciones certificaciones = servicioCertificaciones.crearCertificaciones(profesional, certificacion.tipo_certificacion, certificacion.nombre_certificacion,certificacion.institucion_emisora);            
        }

        if(servicio != null && servicio.nombreServicio != null){
            @SuppressWarnings("unused")
            ServicioProfesional servicios = servicioServicioProfesional.crearServicioProfesional(profesional, servicio);
        }

        
         }
}

