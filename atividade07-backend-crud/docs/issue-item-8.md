# Exercícios do item 8 — Melhorias na API

## Tarefas
- [ ] Criar `GET /pacientes/total`, retornando `{ "total": N }`.
- [ ] Explicar por que essa rota precisa ficar antes de `/pacientes/:id`.
- [ ] Impedir e-mail duplicado e retornar status `409 Conflict`.
- [ ] Implementar filtro por nome: `GET /pacientes?nome=ana`, usando `req.query.nome`.
- [ ] Testar `DELETE /pacientes/999` e `POST /pacientes` com corpo vazio.
- [ ] Registrar os resultados e verificar os status HTTP.

## Critério de conclusão
As rotas extras e os casos de erro foram testados e documentados.
