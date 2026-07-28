package com.bd.mindexa.models.empresa;

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

@Setter
@Getter

@Data
@Entity
@Table(name = "empresa")

public class Empresa {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "id_empresa")
private int idEmpresa;
@Column(name="razon_social")
private String razonSocial;
private String nombre_comercial;
private String correo;
private String sitio_web;
private String telefono;
private String direccion;
private LocalDateTime creado_en;
private LocalDateTime actualizado_en;
private LocalDateTime desactivado_en;

}
