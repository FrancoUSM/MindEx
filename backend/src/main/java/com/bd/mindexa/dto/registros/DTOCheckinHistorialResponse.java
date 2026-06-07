package com.bd.mindexa.dto.registros;

import com.bd.mindexa.models.usuario.paciente.AnalisisRiesgo;

public class DTOCheckinHistorialResponse {
    public int id;
    public String contenido;
    public String estado_riesgo;
    public String fecha;
    public Integer rhi_score;
    public Integer id_score;
    public Integer ir_score;
    public String color_base;
    public String color_final;
    public Boolean flag_convergencia_critica;
    public Boolean flag_somnolencia_critica;
    public Boolean flag_estres_desregulado;

    public DTOCheckinHistorialResponse(AnalisisRiesgo a) {
        this.id = a.getId_analisis_riesgo();
        this.contenido = a.getContenido_analisis();
        this.estado_riesgo = a.getEstado_riesgo() != null ? a.getEstado_riesgo().name() : "RIESGO_BAJO";
        this.fecha = a.getCreado_en() != null ? a.getCreado_en().toString() : "";
        this.rhi_score = a.getRhi_score();
        this.id_score = a.getId_score();
        this.ir_score = a.getIr_score();
        this.color_base = a.getColor_base();
        this.color_final = a.getColor_final();
        this.flag_convergencia_critica = a.getFlag_convergencia_critica();
        this.flag_somnolencia_critica = a.getFlag_somnolencia_critica();
        this.flag_estres_desregulado = a.getFlag_estres_desregulado();
    }
}
