# Exercícios do item 8 — Melhorias na API

## Implementação

- [x] Criar `GET /pacientes/total`, retornando `{ "total": N }`.
- [x] Impedir e-mail duplicado no cadastro, retornando status `409 Conflict`.
- [x] Implementar filtro por nome: `GET /pacientes?nome=ana`, usando `req.query.nome`.
- [x] Tratar `DELETE /pacientes/999` com status `404`.
- [x] Tratar `POST /pacientes` com corpo vazio com status `400`.

## Explicação da ordem das rotas

A rota `GET /pacientes/total` deve ser declarada antes de `GET /pacientes/:id`.
Se `/pacientes/:id` vier primeiro, o Express interpreta o trecho `total` como o valor do parâmetro `id`. Assim, a requisição pode cair na busca por um paciente cujo ID seria `NaN` e responder `404`, em vez de retornar a quantidade de pacientes.

## Testes para executar

Os comandos abaixo podem ser executados com o backend ligado (localmente, na porta 3000):

```bash
# 1. Quantidade total: esperado 200 e {"total":3}
curl -i http://localhost:3000/pacientes/total

# 2. E-mail já existente: esperado 409
curl -i -X POST http://localhost:3000/pacientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"Outro Nome","email":"ana.costa@example.com","nascimento":"2000-01-01"}'

# 3. Filtro pelo nome: esperado 200 e apenas Ana Costa
curl -i "http://localhost:3000/pacientes?nome=ana"

# 4. Exclusão de ID inexistente: esperado 404
curl -i -X DELETE http://localhost:3000/pacientes/999

# 5. Corpo vazio: esperado 400
curl -i -X POST http://localhost:3000/pacientes \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Resultado esperado dos testes

| Requisição | Status esperado | Motivo |
|---|---:|---|
| `GET /pacientes/total` | 200 | Retorna a quantidade de pacientes |
| `POST /pacientes` com e-mail duplicado | 409 | Conflito: e-mail já cadastrado |
| `GET /pacientes?nome=ana` | 200 | Retorna nomes que contêm “ana”, sem diferenciar maiúsculas/minúsculas |
| `DELETE /pacientes/999` | 404 | Paciente não encontrado |
| `POST /pacientes` com `{}` | 400 | Campos obrigatórios ausentes |

**Observação:** os dados são mantidos em memória. Cadastros e exclusões feitos durante os testes não são persistidos após reiniciar o servidor.
