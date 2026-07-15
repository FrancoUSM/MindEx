package com.bd.mindexa.controllers.plan;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bd.mindexa.dto.registros.DTORegistroPlan;
import com.bd.mindexa.models.plan.Plan;
import com.bd.mindexa.orquestador.OrquestadorPlan;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/plan")
@RequiredArgsConstructor
@Validated
public class PlanController {
private final OrquestadorPlan orquestadorPlan;
private final com.bd.mindexa.services.plan.ServicioPlan servicioPlan;

//OBTENER TODOS
@GetMapping("")
public ResponseEntity<List<Plan>> getPlan(){ 
 return ResponseEntity.ok(servicioPlan.getPlanes());
}

@GetMapping("/id/{id}")
public ResponseEntity<Plan> getPlanById(@PathVariable int id){
    return ResponseEntity.ok(servicioPlan.getPlanById(id));
}


//CREAR
@PostMapping("/crear")
public ResponseEntity<Map<String, String>> crearPlan(@RequestBody DTORegistroPlan request){
    orquestadorPlan.crearRegistroPlan(request);
return ResponseEntity.ok(Map.of("message", "Plan creado correctamente"));
}

//ACTUALIZAR
@PutMapping("/actualizar/{id}")
public ResponseEntity<Map<String, String>> actualizarPlan(@PathVariable int id, @RequestBody DTORegistroPlan request){
    Plan plan = servicioPlan.getPlanById(id);
    servicioPlan.actualizarPlan(plan, request.nombre_plan, request.tipo_plan, request.descripcion_plan, request.precio_por_usuario, request.duracion_meses);
    return ResponseEntity.ok(Map.of("message", "Plan actualizado correctamente"));
}

//ELIMINAR
@DeleteMapping("/eliminar/{id}")
public ResponseEntity<Map<String, String>> eliminarPlan(@PathVariable int id){
    servicioPlan.eliminarPlan(id);
    return ResponseEntity.ok(Map.of("message", "Plan eliminado correctamente"));
}

}