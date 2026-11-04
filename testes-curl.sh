
#!/bin/bash

# 1. GET - Listar pacientes
curl -i -X GET https://api-clinica-felipe-andrade.onrender.com/pacientes

# 2. POST - Cadastrar paciente
curl -i -X POST https://api-clinica-felipe-andrade.onrender.com/pacientes \
    -H "Content-Type: application/json" \
    -d '{"nome":"Paciente Teste CLI","email":"teste.cli2@email.com","nascimento":"1998-05-20"}'

# 3. GET - Buscar paciente por ID
curl -i -X GET https://api-clinica-felipe-andrade.onrender.com/pacientes/5

# 4. PUT - Atualizar paciente
curl -i -X PUT https://api-clinica-felipe-andrade.onrender.com/pacientes/5 \
    -H "Content-Type: application/json" \
    -d '{"nome":"Paciente Atualizado CLI","email":"teste.cli2@email.com","nascimento":"1998-05-20"}'

# 5. DELETE - Remover paciente
curl -i -X DELETE https://api-clinica-felipe-andrade.onrender.com/pacientes/5

