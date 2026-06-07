package com.bd.mindexa.models.usuario.profesional;
import com.bd.mindexa.models.usuario.Profesional;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
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
@Table(name = "profesional_idioma")
public class ProfesionalIdioma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_profesional_idioma")
    private int id_profesional_idioma;

    @ManyToOne
    @JoinColumn(name = "id_usuario_profesional")
    private Profesional usuarioProfesional;

    @ManyToOne
    @JoinColumn(name = "id_idioma")
    private Idioma idioma;
    @Enumerated(EnumType.STRING)
    private NivelHabilidad nivel_habilidad;
    public enum NivelHabilidad {A1,A2,B1,B2,C1,C2,NATIVO,BASICO,INTERMEDIO,AVANZADO}

    

}
