package com.bd.mindexa.models.usuario.profesional;
import com.bd.mindexa.models.usuario.Profesional;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
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
@Table(name = "enfoque_terapeutico_principal")
public class EnfoqueTerapeuticoPrincipal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_enfoque_terapeutico_principal")
    private int id_enfoque_terapeutico_principal;

    @OneToOne
    @JoinColumn(name="id_usuario_profesional")
    private Profesional usuario_profesional;

    @OneToOne
    @JoinColumn(name="id_enfoque_terapeutico")
    private EnfoqueTerapeutico enfoqueTerapeutico;

}
