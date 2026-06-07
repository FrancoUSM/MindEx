package com.bd.mindexa.models.suscripcion;
import java.time.LocalDateTime;

import com.bd.mindexa.models.usuario.Paciente;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
@Table(name = "paciente_suscrito")
@Entity
public class PacienteSuscrito {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "id_paciente_suscrito")
    private int id_paciente_suscrito;
    @ManyToOne
    @JoinColumn(name = "id_suscripcion")
    private Suscripcion suscripcion;
    @ManyToOne
    @JoinColumn(name = "id_paciente")
    private Paciente paciente;
    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;


}
