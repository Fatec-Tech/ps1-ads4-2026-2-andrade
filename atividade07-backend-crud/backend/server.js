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

app.get('/pacientes', (req, res) => {
  const filtro = String(req.query.nome || '').toLowerCase();
  const resultado = filtro ? pacientes.filter(p => p.nome.toLowerCase().includes(filtro)) : pacientes;
  res.status(200).json(resultado);
});

// A rota específica deve vir antes de /pacientes/:id.
app.get('/pacientes/total', (req, res) => res.status(200).json({ total: pacientes.length }));

app.get('/pacientes/:id', (req, res) => {
  const paciente = pacientes.find(p => p.id === Number(req.params.id));
  if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });
  return res.status(200).json(paciente);
});

app.post('/pacientes', (req, res) => {
  const { nome, email, nascimento } = req.body ?? {};
  if (!nome || !email || !nascimento) {
    return res.status(400).json({ erro: 'Nome, e-mail e nascimento são obrigatórios.' });
  }
  const emailNormalizado = String(email).trim().toLowerCase();
  if (pacientes.some(p => p.email.trim().toLowerCase() === emailNormalizado)) {
    return res.status(409).json({ erro: 'Já existe um paciente com esse e-mail.' });
  }
  const novo = { id: proximoId++, nome: String(nome).trim(), email: String(email).trim(), nascimento: String(nascimento) };
  pacientes.push(novo);
  return res.status(201).json(novo);
});

app.put('/pacientes/:id', (req, res) => {
  const paciente = pacientes.find(p => p.id === Number(req.params.id));
  if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });
  const { nome, email, nascimento } = req.body ?? {};
  if (!nome || !email || !nascimento) {
    return res.status(400).json({ erro: 'Nome, e-mail e nascimento são obrigatórios.' });
  }
  const emailNormalizado = String(email).trim().toLowerCase();
  if (pacientes.some(p => p.id !== paciente.id && p.email.trim().toLowerCase() === emailNormalizado)) {
    return res.status(409).json({ erro: 'Já existe outro paciente com esse e-mail.' });
  }
  paciente.nome = String(nome).trim();
  paciente.email = String(email).trim();
  paciente.nascimento = String(nascimento);
  return res.status(200).json(paciente);
});

app.delete('/pacientes/:id', (req, res) => {
  const indice = pacientes.findIndex(p => p.id === Number(req.params.id));
  if (indice === -1) return res.status(404).json({ erro: 'Paciente não encontrado' });
  pacientes.splice(indice, 1);
  return res.status(204).send();
});

app.get('/', (req, res) => res.status(200).send('API funcionando. Acesse /pacientes.'));
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));
