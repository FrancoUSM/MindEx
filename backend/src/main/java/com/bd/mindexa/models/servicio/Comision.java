package com.bd.mindexa.models.servicio;
import java.time.LocalDateTime;

import com.bd.mindexa.models.atencion.AgendamientoAtencion;
import com.bd.mindexa.models.atencion.SesionUrgencia;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Data
@Table(name = "comision")
public class Comision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comision")
    private int id_comision;

    @OneToOne
    private AgendamientoAtencion agendamiento_atencion;

    @OneToOne
    private SesionUrgencia atencion_urgencia;
    
    private int comision;
    private LocalDateTime creado_en;
    

}
