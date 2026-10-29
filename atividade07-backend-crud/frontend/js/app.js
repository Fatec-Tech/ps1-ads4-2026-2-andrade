// Local: http://localhost:3000 | Em produção, use a URL do backend Render sem /pacientes.
const API_BASE_URL = 'https://api-clinica-felipe-andrade.onrender';
const URL_API = `${API_BASE_URL}/pacientes`;
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const mensagem = document.getElementById('mensagem');
const carregando = document.getElementById('carregando');
const campoId = document.getElementById('id');
const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoNascimento = document.getElementById('nascimento');
const botaoSalvar = document.getElementById('btn-salvar');
const botaoCancelar = document.getElementById('btn-cancelar');

function mostrarMensagem(texto, tipo = 'danger') {
  mensagem.replaceChildren();
  const alerta = document.createElement('div');
  alerta.className = `alert alert-${tipo}`;
  alerta.textContent = texto;
  mensagem.appendChild(alerta);
}
function celula(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}
function formatarData(data) {
  const p = data.split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : data;
}
function renderizarTabela(pacientes) {
  tabela.replaceChildren();
  if (!pacientes.length) {
    const tr = document.createElement('tr');
    const td = celula('Nenhum paciente cadastrado.');
    td.colSpan = 4; tr.appendChild(td); tabela.appendChild(tr); return;
  }
  pacientes.forEach(p => {
    const tr = document.createElement('tr');
    tr.append(celula(p.nome), celula(p.email), celula(formatarData(p.nascimento)));
    const acoes = document.createElement('td');
    const editar = document.createElement('button');
    editar.type = 'button'; editar.textContent = 'Editar'; editar.className = 'btn btn-sm btn-outline-primary me-2';
    editar.addEventListener('click', () => iniciarEdicao(p));
    const excluir = document.createElement('button');
    excluir.type = 'button'; excluir.textContent = 'Excluir'; excluir.className = 'btn btn-sm btn-outline-danger';
    excluir.addEventListener('click', () => excluirPaciente(p.id));
    acoes.append(editar, excluir); tr.appendChild(acoes); tabela.appendChild(tr);
  });
}
async function listarPacientes() {
  carregando.classList.remove('d-none'); carregando.textContent = 'Carregando pacientes...';
  try {
    const r = await fetch(URL_API);
    if (!r.ok) throw new Error(`Erro HTTP ${r.status}`);
    renderizarTabela(await r.json()); carregando.classList.add('d-none');
  } catch (e) {
    console.error(e); carregando.textContent = 'Não foi possível carregar. Confira se o backend está ativo e se a URL da API está correta.';
  }
}
function iniciarEdicao(p) {
  campoId.value = p.id; campoNome.value = p.nome; campoEmail.value = p.email; campoNascimento.value = p.nascimento;
  botaoSalvar.textContent = 'Salvar alterações'; botaoCancelar.classList.remove('d-none');
  document.getElementById('titulo-formulario').textContent = 'Editar paciente';
  window.scrollTo({ top: 0, behavior: 'smooth' }); campoNome.focus();
}
function limparFormulario() {
  formulario.reset(); campoId.value = ''; botaoSalvar.textContent = 'Cadastrar';
  botaoCancelar.classList.add('d-none'); document.getElementById('titulo-formulario').textContent = 'Cadastrar paciente';
}
async function salvarPaciente(dados, id) {
  const r = await fetch(id ? `${URL_API}/${id}` : URL_API, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  if (!r.ok) {
    let erro = {};
    try { erro = await r.json(); } catch (_) {}
    throw new Error(erro.erro || `Erro HTTP ${r.status}`);
  }
}
async function excluirPaciente(id) {
  if (!confirm('Deseja realmente excluir este paciente?')) return;
  try {
    const r = await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
    if (!r.ok) {
      let erro = {};
      try { erro = await r.json(); } catch (_) {}
      throw new Error(erro.erro || `Erro HTTP ${r.status}`);
    }
    mostrarMensagem('Paciente excluído com sucesso.', 'success'); await listarPacientes();
  } catch (e) { mostrarMensagem(e.message); }
}
formulario.addEventListener('submit', async event => {
  event.preventDefault();
  const dados = { nome: campoNome.value.trim(), email: campoEmail.value.trim(), nascimento: campoNascimento.value };
  const estavaEditando = Boolean(campoId.value);
  try {
    await salvarPaciente(dados, campoId.value);
    mostrarMensagem(estavaEditando ? 'Paciente atualizado com sucesso.' : 'Paciente cadastrado com sucesso.', 'success');
    limparFormulario(); await listarPacientes();
  } catch (e) { mostrarMensagem(e.message); }
});
botaoCancelar.addEventListener('click', limparFormulario);
document.getElementById('btn-atualizar-lista').addEventListener('click', listarPacientes);
listarPacientes();
