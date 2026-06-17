package com.bd.mindexa.models.usuario.paciente;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.bd.mindexa.models.usuario.Usuario;

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
@Table(name = "notificaciones")
@Setter
@Getter
public class Notificaciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notificacion")
    private int id_notificacion;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @OneToOne
    @JoinColumn(name = "id_alertas_riesgo")
    private AlertasRiesgo alertasRiesgo;
    

    private String contenido_notificacion;
    public enum Categoria{ALERTA, AVISO}
    private Categoria categoria;
    private LocalDate fecha_notificacion;
    public enum EstadoEnvio{ENVIADO, ESPERANDO, DESECHADO};
    private EstadoEnvio estado_envio;
    private LocalDateTime creado_en;
    private LocalDateTime enviado_en;


}
