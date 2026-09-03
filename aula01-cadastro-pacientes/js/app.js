// Array que guarda os pacientes cadastrados (em memória, só nesta sessão)
const pacientes = [];

// Referências aos elementos do DOM que vamos usar várias vezes
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const contador = document.getElementById('contador-pacientes');

// Função responsável por adicionar um paciente ao array
function adicionarPaciente(nome, email, telefone, nascimento) {
  const emailExiste = pacientes.some((paciente) => paciente.email === email);

  if (emailExiste) {
    alert('Este e-mail já está cadastrado!');
    return;
  }

  const novoPaciente = {nome, email, telefone, nascimento };
  pacientes.push(novoPaciente);
}

// Função responsável por desenhar a tabela inteira a partir do array
function renderizarTabela() {
  tabela.innerHTML = ''; // limpa a tabela antes de redesenhar

  pacientes.forEach((paciente, indice) => {
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td>${paciente.email}</td>
      <td>${paciente.telefone}</td>
      <td>${formatarData(paciente.nascimento)}</td>
      <td>${calcularIdade(paciente.nascimento)}</td>
      <td><button onclick="removerPaciente(${indice})">Remover</button></td>
    `;

    tabela.appendChild(linha);
  });

  contador.textContent = `Total de pacientes: ${pacientes.length}`;
}

// Função utilitária só para formatar a data no padrão dd/mm/aaaa
function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// funcao pra calcular idade
function calcularIdade(dataNascimento){
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);

  let idade = hoje.getFullYear() - nascimento.getFullYear();

// faz a conta do mes
  let mes = hoje.getMonth() - nascimento.getMonth();

  if (mes<0 || (mes === 0 && hoje.getDate() < nascimento.getDate())){
    idade--;
  }

  return idade;
}

//funcao para remover usuario
function removerPaciente(indice){
  pacientes.splice(indice, 1);
  renderizarTabela();
}

// Evento disparado quando o formulário é enviado
formulario.addEventListener('submit', (event) => {
  event.preventDefault(); // evita o recarregamento da página

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const telefone = document.getElementById('telefone').value;
  const nascimento = document.getElementById('nascimento').value;

  adicionarPaciente(nome, email, telefone, nascimento);
  renderizarTabela();

  formulario.reset(); // limpa os campos do formulário
});