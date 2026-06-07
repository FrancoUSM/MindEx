package com.bd.mindexa.models.suscripcion;

import java.time.LocalDateTime;
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
@Table(name = "estado_suscripcion")
@Entity
public class EstadoSuscripcion {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "id_estado_suscripcion")
    private int id_estado_suscripcion;

    @ManyToOne
    @JoinColumn(name = "id_suscripcion")
    private Suscripcion suscripcionEmpresa;


    @Enumerated(EnumType.STRING)
    private Estado estado;
    public enum Estado{ACTIVA,SUSPENDIDA,CANCELADA}
    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;



}
