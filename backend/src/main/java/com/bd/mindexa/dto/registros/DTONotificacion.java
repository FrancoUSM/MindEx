package com.bd.mindexa.dto.registros;

import com.bd.mindexa.models.usuario.paciente.Notificaciones;

public class DTONotificacion {
    public int id;
    public String contenido;
    public String categoria;
    public String estado;
    public String fecha;

    public DTONotificacion(Notificaciones n) {
        this.id = n.getId_notificaciones();
        this.contenido = n.getContenido_notificacion();
        this.categoria = n.getCategoria() != null ? n.getCategoria().name() : "AVISO";
        this.estado = n.getEstado_envio() != null ? n.getEstado_envio().name() : "ESPERANDO";
        this.fecha = n.getFecha_notificacion() != null ? n.getFecha_notificacion().toString() : null;
    }
}
