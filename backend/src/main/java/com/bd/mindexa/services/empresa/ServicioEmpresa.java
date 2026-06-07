package com.bd.mindexa.services.empresa;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.bd.mindexa.models.empresa.Empresa;

import java.time.LocalDateTime;
import java.util.List;
import com.bd.mindexa.repository.empresa.RepositorioEmpresa;
@Service
@Slf4j
@RequiredArgsConstructor


public class ServicioEmpresa {

    private final RepositorioEmpresa repositorioEmpresa;

    public List<Empresa> getEmpresas() {
        return repositorioEmpresa.findAll();
    }

    public Empresa getEmpresaById(int id){
        return repositorioEmpresa.findById(id)
        .orElseThrow(()-> new RuntimeException("Empresa no encontrada"));
    }

    public Empresa crearEmpresa(Empresa empresa){
        empresa.setCreado_en(LocalDateTime.now());
        empresa.setActualizado_en(LocalDateTime.now());
        Empresa crearEmpresa = repositorioEmpresa.save(empresa);
        log.info("Empresa con id {} guardada", crearEmpresa.getId_empresa());
        return crearEmpresa;
    }


     public Empresa actualizarEmpresa(Empresa empresa) {
        Empresa empresaExistente = repositorioEmpresa.findById(empresa.getId_empresa())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada para actualizar"));

        empresa.setCreado_en(empresaExistente.getCreado_en());
        empresa.setActualizado_en(LocalDateTime.now());

        Empresa empresaActualizada = repositorioEmpresa.save(empresa);
        log.info("Empresa con id {} actualizada correctamente", empresaActualizada.getId_empresa());
        return empresaActualizada;
    }

    public void eliminarEmpresa(int id) {
        if (repositorioEmpresa.existsById(id)) {
            repositorioEmpresa.deleteById(id);
            log.info("Empresa con id {} eliminada correctamente", id);
        } else {
            log.warn("Intento de eliminar empresa con id {} que no existe", id);
        }
    }


}
