package com.bd.mindexa.models.test;

import jakarta.persistence.GeneratedValue;

import java.time.LocalDateTime;

import com.bd.mindexa.models.usuario.paciente.RespuestaPacienteTest;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Data
@Table(name = "medicion_respuesta_test")
public class MedicionRespuestaTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medicion_respuesta_test")
    private int id_medicion_respuesta_test;

    @ManyToOne
    @JoinColumn(name = "id_respuesta_paciente_test")
    private RespuestaPacienteTest respuesta_paciente_test;
    private int puntaje_obtenido;
    private LocalDateTime creado_en;
    private LocalDateTime desactivado_en;

}
