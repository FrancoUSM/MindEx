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
private int id_empresa;
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

public Empresa() {
}

public Empresa(int id_empresa, String razonSocial, String nombre_comercial, String correo, String sitio_web,
        String telefono, String direccion, LocalDateTime creado_en, LocalDateTime actualizado_en,
        LocalDateTime desactivado_en) {
    this.id_empresa = id_empresa;
    this.razonSocial = razonSocial;
    this.nombre_comercial = nombre_comercial;
    this.correo = correo;
    this.sitio_web = sitio_web;
    this.telefono = telefono;
    this.direccion = direccion;
    this.creado_en = creado_en;
    this.actualizado_en = actualizado_en;
    this.desactivado_en = desactivado_en;}

    

}
