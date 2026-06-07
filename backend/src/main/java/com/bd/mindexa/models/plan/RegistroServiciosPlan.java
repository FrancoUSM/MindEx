package com.bd.mindexa.models.plan;
import java.time.LocalDateTime;
import com.bd.mindexa.models.servicio.Servicio;

import jakarta.persistence.GeneratedValue;
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
@Table(name = "registro_servicios_plan")
public class RegistroServiciosPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_registro_servicios_plan")
    private int id_registro_servicios_plan;

    @ManyToOne
    @JoinColumn(name="id_plan")
    private Plan plan;

    @ManyToOne
    @JoinColumn(name = "id_servicio")
    private Servicio servicio;

    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;
}
