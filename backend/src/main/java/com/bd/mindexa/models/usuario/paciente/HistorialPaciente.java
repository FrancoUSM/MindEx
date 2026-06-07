package com.bd.mindexa.models.usuario.paciente;
import java.time.LocalDateTime;

import com.bd.mindexa.models.usuario.Paciente;

import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@Table(name = "historial_paciente")
@Setter
@Getter
public class HistorialPaciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial_paciente")
    private int id_historial_paciente;

    @OneToOne
    @JoinColumn(name = "id_paciente")
    private Paciente paciente;
    
    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;

}
