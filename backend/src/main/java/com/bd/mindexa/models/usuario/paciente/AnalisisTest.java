package com.bd.mindexa.models.usuario.paciente;

import jakarta.persistence.GeneratedValue;

import java.time.LocalDateTime;
import java.util.List;

import com.bd.mindexa.models.test.MedicionRespuestaTest;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Data
@Table(name = "analisis_test")
public class AnalisisTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_analisis_test")
    private int id_analisis_test;

    @OneToMany
    private List<MedicionRespuestaTest> medicion_respuesta_test;

    private String resultado;
    private String observacion_clinica;

    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;

}
