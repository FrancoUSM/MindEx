package com.bd.mindexa.models.atencion;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Data
@Table(name = "dia_disponible")
public class DiaDisponible {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dia_disponible")
    private int id_dia_disponible;

    private LocalDate diaDisponible;
    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;



}
