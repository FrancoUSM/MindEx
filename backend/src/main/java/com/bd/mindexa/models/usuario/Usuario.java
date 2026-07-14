package com.bd.mindexa.models.usuario;
import java.time.LocalDateTime;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@Table(name = "usuario")
@Setter


public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private int idUsuario;
    private String nombre;
    private String apellido;

    @Enumerated(EnumType.STRING)
    private Rol rol;
    public enum Rol {ADMIN, GERENTE, USER, PROFESIONAL}

    @Enumerated(EnumType.STRING)
    private Estado estado;
    public enum Estado{ACTIVO, INACTIVO}
    
    private String correo;
    private String telefono;
    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;

  




}
