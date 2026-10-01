const API_URL = 'https://pokeapi.co/api/v2/pokemon';

const pokemonGrid = document.getElementById('pokemonGrid');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const pokemonModalElement = document.getElementById('pokemonModal');
const pokemonModalTitle = document.getElementById('pokemonModalTitle');
const pokemonModalBody = document.getElementById('pokemonModalBody');

let pokemonModal = null;

if (pokemonModalElement && window.bootstrap) {
	pokemonModal = new bootstrap.Modal(pokemonModalElement);
}

async function fetchPokemonData(urlOrName) {
	const value = String(urlOrName).trim();

	const url = value.startsWith('http')
		? value
		: `${API_URL}/${encodeURIComponent(value.toLowerCase())}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}`);
	}

	return await response.json();
}

async function loadInitialPokemon(limit = 20) {
	showLoading(true);
	pokemonGrid.innerHTML = '';

	try {
		const response = await fetch(`${API_URL}?limit=${limit}`);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const data = await response.json();

		const pokemonList = await Promise.all(
			data.results.map((pokemon) => fetchPokemonData(pokemon.url))
		);

		pokemonList.forEach(renderPokemonCard);
	} catch (error) {
		console.error('Erro ao carregar a lista:', error);

		showError(
			'Erro ao carregar a lista de Pokémon. Verifique sua conexão com a internet e tente novamente.'
		);
	} finally {
		showLoading(false);
	}
}

function renderPokemonCard(pokemon) {
	const imageUrl =
		pokemon.sprites?.other?.['official-artwork']?.front_default ||
		pokemon.sprites?.front_default;

	const typesBadges = pokemon.types
		.map(
			(item) =>
				`<span class="badge bg-secondary badge-type me-1">${item.type.name}</span>`
		)
		.join('');

	const cardHTML = `
		<div class="col">
			<div
				class="card h-100 shadow-sm pokemon-card border-0"
				style="cursor: pointer;"
				data-pokemon-id="${pokemon.id}"
			>
				<div class="text-center p-3 bg-white rounded-top">
					<img
						src="${imageUrl}"
						class="card-img-top img-fluid"
						style="max-height: 160px; object-fit: contain;"
						alt="${pokemon.name}"
					>
				</div>

				<div class="card-body">
					<div class="d-flex justify-content-between align-items-center mb-2">
						<h5 class="card-title text-capitalize fw-bold m-0">
							${pokemon.name}
						</h5>
						<small class="text-muted">
							#${String(pokemon.id).padStart(3, '0')}
						</small>
					</div>

					<div class="mb-3">${typesBadges}</div>

					<div class="row text-center border-top pt-2">
						<div class="col-6 border-end">
							<small class="text-muted d-block">Altura</small>
							<strong>${(pokemon.height / 10).toFixed(1)} m</strong>
						</div>

						<div class="col-6">
							<small class="text-muted d-block">Peso</small>
							<strong>${(pokemon.weight / 10).toFixed(1)} kg</strong>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;

	pokemonGrid.insertAdjacentHTML('beforeend', cardHTML);
}

async function openPokemonModal(id) {
	if (!pokemonModal) {
		console.error('Bootstrap Modal não foi inicializado.');
		return;
	}

	pokemonModalTitle.textContent = 'Carregando...';

	pokemonModalBody.innerHTML = `
		<div class="text-center py-5">
			<div class="spinner-border text-danger" role="status">
				<span class="visually-hidden">Carregando...</span>
			</div>
			<p class="mt-3 text-muted">Carregando informações...</p>
		</div>
	`;

	pokemonModal.show();

	try {
		const pokemon = await fetchPokemonData(id);

		pokemonModalTitle.textContent =
			`${pokemon.name} #${String(pokemon.id).padStart(3, '0')}`;

		renderPokemonModal(pokemon);
	} catch (error) {
		console.error('Erro ao carregar detalhes:', error);

		pokemonModalBody.innerHTML = `
			<div class="alert alert-danger text-center">
				Não foi possível carregar os detalhes deste Pokémon.
			</div>
		`;
	}
}

function renderPokemonModal(pokemon) {
	const getStat = (name) =>
		pokemon.stats.find((item) => item.stat.name === name)?.base_stat ?? 0;

	const abilities = pokemon.abilities
		.map(
			(item) =>
				`<span class="badge bg-secondary me-1 mb-1 text-capitalize">${item.ability.name}</span>`
		)
		.join('');

	const sprites = [
		['Normal - Frente', pokemon.sprites.front_default],
		['Normal - Costas', pokemon.sprites.back_default],
		['Shiny - Frente', pokemon.sprites.front_shiny],
		['Shiny - Costas', pokemon.sprites.back_shiny]
	]
		.filter(([, url]) => url)
		.map(
			([label, url]) => `
				<div class="col-6 col-md-3 text-center">
					<p class="small mb-1">${label}</p>
					<img src="${url}" class="img-fluid" alt="${pokemon.name} ${label}">
				</div>
			`
		)
		.join('');

	const cry = pokemon.cries?.latest || pokemon.cries?.legacy;

	pokemonModalBody.innerHTML = `
		<div class="container-fluid">
			<div class="mb-4">
				<h6 class="fw-bold">Sprites</h6>
				<div class="row">${sprites}</div>
			</div>

			<div class="mb-4">
				<h6 class="fw-bold">Status Base</h6>
				${createStatBar('HP', getStat('hp'))}
				${createStatBar('Ataque', getStat('attack'))}
				${createStatBar('Defesa', getStat('defense'))}
				${createStatBar('Velocidade', getStat('speed'))}
			</div>

			<div class="mb-4">
				<h6 class="fw-bold">Habilidades</h6>
				${abilities}
			</div>

			<div>
				<h6 class="fw-bold">Som do Pokémon</h6>
				${
					cry
						? `<audio controls preload="metadata" class="w-100" src="${cry}">
								Seu navegador não suporta áudio.
						   </audio>`
						: '<p class="text-muted">Som não disponível.</p>'
				}
			</div>
		</div>
	`;
}

function createStatBar(name, value) {
	return `
		<div class="mb-3">
			<div class="d-flex justify-content-between">
				<small class="fw-bold">${name}</small>
				<small>${value}</small>
			</div>

			<div class="progress" style="height: 10px;">
				<div
					class="progress-bar"
					role="progressbar"
					style="width: ${Math.min(value, 100)}%"
					aria-valuenow="${value}"
					aria-valuemin="0"
					aria-valuemax="100"
				></div>
			</div>
		</div>
	`;
}

async function handleSearch() {
	const query = searchInput.value.trim();

	if (!query) {
		loadInitialPokemon();
		return;
	}

	showLoading(true);
	pokemonGrid.innerHTML = '';

	try {
		const pokemon = await fetchPokemonData(query);
		renderPokemonCard(pokemon);
	} catch (error) {
		console.error('Erro na busca:', error);
		showError(`Nenhum Pokémon encontrado com o termo "${query}".`);
	} finally {
		showLoading(false);
	}
}

function showLoading(state) {
	loading.classList.toggle('d-none', !state);
}

function showError(message) {
	pokemonGrid.innerHTML = `
		<div class="col-12">
			<div class="alert alert-warning text-center" role="alert">
				${message}
			</div>
		</div>
	`;
}

// Event delegation: funciona tanto para a lista inicial quanto para resultados da busca.
pokemonGrid.addEventListener('click', (event) => {
	const card = event.target.closest('[data-pokemon-id]');

	if (!card) {
		return;
	}

	openPokemonModal(card.dataset.pokemonId);
});

searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keypress', (event) => {
	if (event.key === 'Enter') {
		handleSearch();
	}
});

loadInitialPokemon();
