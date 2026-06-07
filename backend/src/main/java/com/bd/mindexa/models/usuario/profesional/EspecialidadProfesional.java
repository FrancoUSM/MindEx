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
@Table(name = "especialidad_profesional")

public class EspecialidadProfesional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_especialidad_profesional")
    private int id_especialidad_profesional;

@ManyToOne
@JoinColumn(name = "id_usuario_profesional")
private Profesional usuarioProfesional;

@ManyToOne
@JoinColumn(name = "id_especialidad")
private Especialidad especialidad;

}
