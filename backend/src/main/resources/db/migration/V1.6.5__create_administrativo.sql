create table administrativo(
    id_administrativo serial primary key,
    id_usuario int not null references usuario(id_usuario),
    creado_en timestamp default now(),
    actualizado_en timestamp default now(),
    desactivado_en timestamp default null,
    constraint fk_administrativo_usuario foreign key (id_usuario) references usuario(id_usuario)
);
