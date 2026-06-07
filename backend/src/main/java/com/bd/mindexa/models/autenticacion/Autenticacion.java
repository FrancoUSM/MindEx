package com.bd.mindexa.models.autenticacion;
import java.time.LocalDateTime;

import com.bd.mindexa.models.usuario.Usuario;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;

@Data
@Entity
@Table(name = "autenticacion_usuario")
@Getter
@Setter

public class Autenticacion {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "id_autenticacion")
    private int id_autenticacion;
    @OneToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
    
    private String contrasena_hash;
    @Enumerated(EnumType.STRING)
    private Estado estado;
    public enum Estado{ACTIVO, INACTIVO, BLOQUEADO}
    private LocalDateTime creado_en;
    private LocalDateTime actualizado_en;
    private LocalDateTime desactivado_en;

    public Autenticacion() {
    }
    public Autenticacion(int id_autenticacion, Usuario usuario, String contrasena_hash, Estado estado, LocalDateTime creado_en,
            LocalDateTime actualizado_en, LocalDateTime desactivado_en) {
        this.id_autenticacion = id_autenticacion;
        this.contrasena_hash = contrasena_hash;
        this.estado = estado;
        this.creado_en = creado_en;
        this.actualizado_en = actualizado_en;
        this.desactivado_en = desactivado_en;
        this.usuario = usuario;
    }

    @SuppressWarnings("deprecation")
    public void setContrasena(String contrasena) {
        
        Argon2 argon2 = Argon2Factory.create();
        this.contrasena_hash = argon2.hash(2, 65536, 1, contrasena);
    }

    public void verificarUsuario(Usuario usuario){
        Autenticacion autenticacion = new Autenticacion();
        autenticacion.getUsuario().getCorreo();
    }


}
