package com.bd.mindexa.dto.registros;

import java.util.List;

import com.bd.mindexa.models.usuario.Profesional;
import com.bd.mindexa.models.usuario.profesional.EspecialidadProfesional;
import com.bd.mindexa.models.usuario.profesional.ProfesionalIdioma;
import com.bd.mindexa.models.usuario.profesional.ServicioProfesional;

public class DTOProfesionalResponse {
    public int id;
    public String nombre;
    public String apellido;
    public String correo;
    public String biografia;
    public String formacion_academica;
    public int anos_experiencia;
    public boolean acepta_mindexa;
    public int numero_registro_salud;
    public List<String> especialidades;
    public List<String> idiomas;
    public Integer precio;
    public Integer duracion;
    public String tipo_servicio;

    public DTOProfesionalResponse(
            Profesional p,
            List<EspecialidadProfesional> especialidadesList,
            List<ProfesionalIdioma> idiomasList,
            List<ServicioProfesional> serviciosList) {

        this.id = p.getId_profesional();
        this.nombre = p.getUsuario().getNombre();
        this.apellido = p.getUsuario().getApellido();
        this.correo = p.getUsuario().getCorreo();
        this.biografia = p.getBiografia_profesional();
        this.formacion_academica = p.getDescripcion_formacion_academica();
        this.anos_experiencia = p.getAnos_experiencia();
        this.acepta_mindexa = p.isAcepta_empleados_mindexa();
        this.numero_registro_salud = p.getNumero_registro_salud();

        this.especialidades = especialidadesList.stream()
                .filter(e -> e.getEspecialidad() != null)
                .map(e -> e.getEspecialidad().getNombreEspecialidad())
                .toList();

        this.idiomas = idiomasList.stream()
                .filter(i -> i.getIdioma() != null)
                .map(i -> i.getIdioma().getIdioma())
                .toList();

        if (!serviciosList.isEmpty()) {
            ServicioProfesional s = serviciosList.get(0);
            this.precio = s.getPrecio_servicio();
            this.duracion = s.getDuracion_servicio();
            this.tipo_servicio = s.getTipo_servicio();
        }
    }
}
