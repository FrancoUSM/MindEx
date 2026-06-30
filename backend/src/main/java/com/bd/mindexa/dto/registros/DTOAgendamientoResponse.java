package com.bd.mindexa.dto.registros;

import com.bd.mindexa.models.atencion.AgendamientoAtencion;

public class DTOAgendamientoResponse {
    public int id;
    public String fecha;
    public String hora;
    public String motivo;
    public String tipo;
    public String estado;
    public String profesional_nombre;
    public String profesional_apellido;

    public DTOAgendamientoResponse(AgendamientoAtencion a) {
    this.id = a.getId_agendamiento_atencion();

    this.fecha = a.getFecha_atencion() != null
            ? a.getFecha_atencion().toLocalDate().toString()
            : null;

    this.hora = a.getFecha_atencion() != null
            ? a.getFecha_atencion().toLocalTime().toString()
            : "";

    this.motivo = a.getRazon_atencion();
    this.tipo = a.getModalidad() != null ? a.getModalidad() : "";
    this.estado = a.getEstado() != null ? a.getEstado().name() : "ACTIVO";

    if (a.getDisponibilidadAtencion() != null
            && a.getDisponibilidadAtencion().getProfesional() != null
            && a.getDisponibilidadAtencion().getProfesional().getUsuario() != null) {

        this.profesional_nombre = a.getDisponibilidadAtencion().getProfesional().getUsuario().getNombre();
        this.profesional_apellido = a.getDisponibilidadAtencion().getProfesional().getUsuario().getApellido();

    } else {
        this.profesional_nombre = "Profesional";
        this.profesional_apellido = "por confirmar";
    }
}       
}
