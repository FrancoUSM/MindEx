package com.bd.mindexa.models.usuario.paciente;

import jakarta.persistence.GeneratedValue;

import java.time.LocalDateTime;

import com.bd.mindexa.models.test.PreguntaTest;
import com.bd.mindexa.models.test.TestPaciente;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
@Table(name = "respuesta_usuario_test")
public class RespuestaPacienteTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_respuesta_paciente_test")
    private int id_respuesta_paciente_test;

    @ManyToOne
    @JoinColumn(name = "id_test_paciente")
    private TestPaciente testPaciente;
    
    @ManyToOne
    @JoinColumn(name = "id_pregunta_test")
    private PreguntaTest pregunta_test;

    private int respuesta;

    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    
}
