package com.bd.mindexa.controllers.empresa;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.bd.mindexa.models.empresa.Empresa;
import com.bd.mindexa.services.empresa.ServicioEmpresa;

import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/empresa")
@RequiredArgsConstructor
@Validated
public class EmpresaController {

    private final ServicioEmpresa servicioEmpresa;

    //Ver empresas
    @GetMapping("")
    public ResponseEntity<List<Empresa>> getEmpresas(){
        return ResponseEntity.ok().body(servicioEmpresa.getEmpresas());
    }

    //Ver empresa por id
    @GetMapping("/{id}")
    public ResponseEntity<Empresa> getEmpresaById(@PathVariable int id){
        return ResponseEntity.ok().body(servicioEmpresa.getEmpresaById(id));
    }

    //Crear empresa
    @PostMapping("/crear")
    public ResponseEntity<Empresa> createEmpresa(@RequestBody Empresa empresa){
        return ResponseEntity.ok().body(servicioEmpresa.crearEmpresa(empresa));
    }

    @PutMapping("")
    public ResponseEntity<Empresa> actualizarEmpresa(@RequestBody Empresa empresa){
        return ResponseEntity.ok().body(servicioEmpresa.actualizarEmpresa(empresa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarEmpresa(@PathVariable int id){
        servicioEmpresa.eliminarEmpresa(id);
        return ResponseEntity.ok().body("Empresa eliminada correctamente");
    }


}
