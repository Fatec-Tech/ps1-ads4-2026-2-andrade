const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const pacientes = [
  { id: 1, nome: 'Maria Silva', email: 'maria.silva@example.com', nascimento: '1990-04-12' },
  { id: 2, nome: 'João Pereira', email: 'joao.pereira@example.com', nascimento: '1985-11-30' },
  { id: 3, nome: 'Ana Costa', email: 'ana.costa@example.com', nascimento: '2001-07-08' },
];

let proximoId = 4;

// Lista pacientes. O filtro é opcional e não diferencia maiúsculas/minúsculas.
app.get('/pacientes', (req, res) => {
  const filtro = String(req.query.nome || '').trim().toLowerCase();

  const resultado = filtro
    ? pacientes.filter((paciente) => paciente.nome.toLowerCase().includes(filtro))
    : pacientes;

  return res.status(200).json(resultado);
});

// Rota específica: deve ficar antes de /pacientes/:id para "total"
// não ser interpretado como o valor do parâmetro :id.
app.get('/pacientes/total', (req, res) => {
  return res.status(200).json({ total: pacientes.length });
});

// Busca um paciente pelo ID.
app.get('/pacientes/:id', (req, res) => {
  const paciente = pacientes.find((item) => item.id === Number(req.params.id));

  if (!paciente) {
    return res.status(404).json({ erro: 'Paciente não encontrado.' });
  }

  return res.status(200).json(paciente);
});

// Cadastra um paciente e impede e-mails duplicados.
app.post('/pacientes', (req, res) => {
  const { nome, email, nascimento } = req.body ?? {};

  if (
    typeof nome !== 'string' || !nome.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof nascimento !== 'string' || !nascimento.trim()
  ) {
    return res.status(400).json({
      erro: 'Nome, e-mail e nascimento são obrigatórios.',
    });
  }

  const emailNormalizado = email.trim().toLowerCase();
  const emailJaCadastrado = pacientes.some(
    (paciente) => paciente.email.trim().toLowerCase() === emailNormalizado
  );

  if (emailJaCadastrado) {
    return res.status(409).json({
      erro: 'Já existe um paciente com esse e-mail.',
    });
  }

  const novoPaciente = {
    id: proximoId++,
    nome: nome.trim(),
    email: email.trim(),
    nascimento: nascimento.trim(),
  };

  pacientes.push(novoPaciente);

  return res.status(201).json(novoPaciente);
});

// Atualiza um paciente.
app.put('/pacientes/:id', (req, res) => {
  const paciente = pacientes.find((item) => item.id === Number(req.params.id));

  if (!paciente) {
    return res.status(404).json({ erro: 'Paciente não encontrado.' });
  }

  const { nome, email, nascimento } = req.body ?? {};

  if (
    typeof nome !== 'string' || !nome.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof nascimento !== 'string' || !nascimento.trim()
  ) {
    return res.status(400).json({
      erro: 'Nome, e-mail e nascimento são obrigatórios.',
    });
  }

  const emailNormalizado = email.trim().toLowerCase();
  const emailJaUsado = pacientes.some(
    (item) =>
      item.id !== paciente.id &&
      item.email.trim().toLowerCase() === emailNormalizado
  );

  if (emailJaUsado) {
    return res.status(409).json({
      erro: 'Já existe outro paciente com esse e-mail.',
    });
  }

  paciente.nome = nome.trim();
  paciente.email = email.trim();
  paciente.nascimento = nascimento.trim();

  return res.status(200).json(paciente);
});

// Exclui um paciente. ID inexistente retorna 404.
app.delete('/pacientes/:id', (req, res) => {
  const indice = pacientes.findIndex(
    (item) => item.id === Number(req.params.id)
  );

  if (indice === -1) {
    return res.status(404).json({ erro: 'Paciente não encontrado.' });
  }

  pacientes.splice(indice, 1);

  return res.status(204).send();
});

app.get('/', (req, res) => {
  return res.status(200).send('API funcionando. Acesse /pacientes.');
});

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
