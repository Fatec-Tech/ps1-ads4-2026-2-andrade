# Perguntas do item 11 — Discussão sobre API REST

## Perguntas
1. Por que usar métodos HTTP diferentes (`GET`, `POST`, `PUT`, `DELETE`) em vez de sempre usar `POST`?
2. Qual a diferença entre `/pacientes` e `/pacientes/5`?
3. Por que a API devolve `201` ao criar e `404` quando não encontra, em vez de sempre `200`?
4. O frontend poderia ser substituído por um aplicativo de celular sem mudar o backend? Por quê?
5. Onde guardar os dados para que não voltem ao estado inicial quando o servidor reiniciar?

## Respostas sugeridas
1. Os métodos expressam intenções diferentes: consultar, criar, atualizar e excluir.
2. `/pacientes` representa a coleção; `/pacientes/5` representa o recurso de ID 5.
3. Os códigos comunicam o resultado correto: `201` indica criação e `404` indica recurso não encontrado.
4. Sim. Outro cliente pode consumir os mesmos endpoints e o mesmo formato JSON.
5. Em um banco persistente, por exemplo PostgreSQL, em vez de um array em memória.
