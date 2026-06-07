package com.bd.mindexa.models.usuario.profesional;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Data
@Table(name = "enfoque_terapeutico")
public class EnfoqueTerapeutico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_enfoque_terapeutico")
    private int id_enfoque_terapeutico;
    private String nombreEnfoque;



}
