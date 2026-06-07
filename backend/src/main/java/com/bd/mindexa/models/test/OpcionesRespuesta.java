package com.bd.mindexa.models.test;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Data
@Table(name = "opciones_respuesta")
public class OpcionesRespuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_opciones_respuesta")
    private int id_opciones_respuesta;

    private String opcion1;
    private String opcion2;
    private String opcion3;
    private String opcion4;

    @ManyToOne
    @JoinColumn(name = "id_pregunta_test")
    private PreguntaTest preguntaTest;

}
