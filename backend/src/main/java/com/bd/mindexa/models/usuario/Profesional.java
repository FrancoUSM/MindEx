package com.bd.mindexa.models.usuario;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Data
@Table(name = "profesional")

public class Profesional{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_profesional")
    private int id_profesional;

    @OneToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    

private String descripcion_formacion_academica;
private byte anos_experiencia;
private String biografia_profesional;
private int numero_registro_salud;
private boolean acepta_empleados_mindexa;



    


}
