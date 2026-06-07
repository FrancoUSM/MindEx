package com.bd.mindexa.services.test;
import java.time.LocalDateTime;



import com.bd.mindexa.models.servicio.Servicio;
import com.bd.mindexa.models.test.PreguntaTest;
import com.bd.mindexa.models.test.Test;
import com.bd.mindexa.repository.servicio.RepositorioServicio;
import com.bd.mindexa.repository.test.RepositorioTest;

import io.micrometer.common.lang.NonNull;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class ServicioTest {

    private final RepositorioTest repositorioTest;
    private final RepositorioServicio repositorioServicio;


    public Test crearTest(int id_servicio, String nombre, String descripcion){

        Test test = new Test();

        Servicio servicio = repositorioServicio.findById(id_servicio).
        orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        test.setServicio(servicio);
        test.setNombre_test(nombre);
        test.setDescripcion(descripcion);
        test.setCreado_en(LocalDateTime.now());
        test.setActualizado_en(LocalDateTime.now());
        
        return repositorioTest.save(test);


    }

    public void actualizarTest(Test test, String nombre, String descripcion){
        if (!nombre.equals(test.getNombre_test())) {
            test.setNombre_test(nombre);
        }
        if (!descripcion.equals(test.getDescripcion())) {
            test.setDescripcion(descripcion);
        }
        test.setActualizado_en(LocalDateTime.now());
        repositorioTest.save(test);
    }

    public void desactivarTest(Test test){
        test.setDesactivado_en(LocalDateTime.now());
        repositorioTest.save(test);
    }

    public void eliminarTest(@NonNull Test test){
        repositorioTest.delete(test);
    }

    public Test getTestById(int id){
        return repositorioTest.findById(id)
                .orElseThrow(() -> new RuntimeException("Test no encontrado"));
    }


}
