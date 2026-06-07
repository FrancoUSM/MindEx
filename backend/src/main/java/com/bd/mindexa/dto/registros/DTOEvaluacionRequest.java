package com.bd.mindexa.dto.registros;

public class DTOEvaluacionRequest {
    public int id_usuario;
    public String tipo;       // "PHQ-9", "GAD-7"
    public int score;
    public int max_score;
    public String severidad;
}
