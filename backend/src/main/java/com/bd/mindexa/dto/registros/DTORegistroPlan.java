package com.bd.mindexa.dto.registros;

import java.util.List;

import com.bd.mindexa.models.servicio.Servicio;

public class DTORegistroPlan {

    public String nombre_plan;
    public String tipo_plan;
    public String descripcion_plan;
    public int precio_por_usuario;
    public int duracion_meses;

    public List<Servicio> servicios;
    
    

}
