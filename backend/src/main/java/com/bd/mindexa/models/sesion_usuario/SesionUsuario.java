package com.bd.mindexa.models.sesion_usuario;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

import com.bd.mindexa.models.usuario.Usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@Table(name = "sesion_usuario")
@Setter
@Getter
public class SesionUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sesion_usuario")
    private int id_sesion_usuario;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;



    private LocalDateTime sesion_abierta_en;
    private LocalDateTime sesion_cerrada_en;
    private String estado_sesion;

}
