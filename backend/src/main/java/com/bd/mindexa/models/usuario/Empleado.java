package com.bd.mindexa.models.usuario;

import java.time.LocalDateTime;

import com.bd.mindexa.models.empresa.Empresa;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Entity
@Table(name = "empleado")
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empleado")
    private int id_empleado;

@ManyToOne
@JoinColumn(name = "id_usuario")
private Usuario usuario;

@ManyToOne
@JoinColumn(name = "id_empresa")
private Empresa empresa;

    private String cargo;
    private String turno;
    private String faena;
    private String contratista;

    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;





}