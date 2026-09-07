// Array que guarda os pacientes cadastrados (em memória, só nesta sessão)
const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

// Referências aos elementos do DOM que vamos usar várias vezes
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const contador = document.getElementById('contador-pacientes');
const busca = document.getElementById('busca');
const ordenarNome = document.getElementById('ordenar-nome')


// Função responsável por adicionar um paciente ao array
function adicionarPaciente(nome, email, telefone, nascimento) {
  const emailExiste = pacientes.some((paciente) => paciente.email === email);

  if (emailExiste) {
    alert('Este e-mail já está cadastrado!');
    return;
  }

  const novoPaciente = {nome, email, telefone, nascimento };
  pacientes.push(novoPaciente);

  localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

// Função responsável por desenhar a tabela inteira a partir do array
function renderizarTabela(lista = pacientes) {
  tabela.innerHTML = ''; // limpa a tabela antes de redesenhar

  lista.forEach((paciente, indice) => {
    const linha = document.createElement('tr');

    const indiceOriginal = pacientes.indexOf(paciente);

    linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td>${paciente.email}</td>
      <td>${paciente.telefone}</td>
      <td>${formatarData(paciente.nascimento)}</td>
      <td>${calcularIdade(paciente.nascimento)}</td>
      <td><button onclick="removerPaciente(${indiceOriginal})">Remover</button></td>
    `;

    tabela.appendChild(linha);
  });

  contador.textContent = `Total de pacientes: ${pacientes.length}`;
}

ordenarNome.addEventListener('click', ()=> {
  pacientes.sort((a, b)=>{
    return a.nome.localeCompare(b.nome);
  })

  renderizarTabela();
})

busca.addEventListener('input', ()=>{
  const textoBusca = busca.value;

  const pacientesFiltrados = pacientes.filter((paciente) => {
  return paciente.nome.toLowerCase().includes(textoBusca.toLowerCase());
});

  renderizarTabela(pacientesFiltrados);
})

// Função utilitária só para formatar a data no padrão dd/mm/aaaa
function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// funcao pra calcular idade
function calcularIdade(dataNascimento){
  const hoje = new Date();
  const [ano, mes, dia] = dataNascimento.split('-');
  const nascimento = new Date(ano, mes - 1, dia);

  let idade = hoje.getFullYear() - nascimento.getFullYear();

// faz a conta do mes
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();

  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
  ) {
  idade--;
}
  // let mes = hoje.getMonth() - nascimento.getMonth();

  // if (mes<0 || (mes === 0 && hoje.getDate() < nascimento.getDate())){
  //   idade--;
  // }

  return idade;
}

//funcao para remover usuario
function removerPaciente(indice){
  pacientes.splice(indice, 1);
  localStorage.setItem('pacientes', JSON.stringify(pacientes));
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

renderizarTabela();