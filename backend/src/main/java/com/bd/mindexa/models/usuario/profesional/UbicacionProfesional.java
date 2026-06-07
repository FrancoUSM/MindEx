package com.bd.mindexa.models.usuario.profesional;
import jakarta.persistence.GeneratedValue;

import com.bd.mindexa.models.usuario.Profesional;

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
@Table(name = "ubicacion_profesional")

public class UbicacionProfesional {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "id_ubicacion_profesional")
private int id_ubicacion_profesional;

@JoinColumn(name = "id_usuario_profesional")
@ManyToOne
private Profesional usuarioProfesional;

private String region;
private String comuna;  
private String ciudad;
private String direccion;


}
