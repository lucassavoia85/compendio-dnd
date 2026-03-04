const mainContent = document.querySelector('main');
const searchInput = document.querySelector('input[type="text"]');
const searchButton = document.querySelector('#botao-busca');
let allDndData = []; // Armazena todos os dados após o fetch

// Função para exibir os cards na tela
function displayCards(items) {
    mainContent.innerHTML = ''; // Limpa o conteúdo principal

    const createSection = (titulo, lista) => {
        if (lista.length === 0) return;

        const sectionTitle = document.createElement('h2');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = titulo;
        mainContent.appendChild(sectionTitle);

        const container = document.createElement('div');
        container.className = 'card-container';

        lista.forEach(item => {
            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <i class="${item.icon} card-icone"></i>
                    <h2>${item.nome}</h2>
                </div>
                <p><strong>Tipo:</strong> ${item.tipo}</p>
                <p>${item.descricao}</p>
                <a href="${item.link}" target="_blank">Saiba mais</a>
            `;
            container.appendChild(card);
        });
        mainContent.appendChild(container);
    };

    const racas = items.filter(item => item.tipo === 'Raça');
    const classes = items.filter(item => item.tipo === 'Classe');

    createSection('Raças', racas);
    createSection('Classes', classes);
}

// Função para iniciar a busca
function iniciarBusca() {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        const filteredItems = allDndData.filter(item =>
            item.nome.toLowerCase().includes(searchTerm) ||
            item.tipo.toLowerCase().includes(searchTerm)
        );
        displayCards(filteredItems);
    } else {
        // Se a busca estiver vazia, mostra todos os itens novamente
        displayCards(allDndData);
    }
}

// Adiciona eventos para acionar a busca
searchButton.addEventListener('click', iniciarBusca);
searchInput.addEventListener('input', iniciarBusca); // Busca em tempo real enquanto digita
searchInput.addEventListener('keydown', (event) => {
    // Permite buscar pressionando a tecla Enter
    if (event.key === 'Enter') {
        iniciarBusca();
    }
});

// Carrega os dados de um arquivo JSON externo
async function carregarDados() {
    try {
        const response = await fetch('src/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allDndData = await response.json();
        displayCards(allDndData);
    } catch (error) {
        console.error("Não foi possível carregar os dados do compêndio:", error);
        mainContent.innerHTML = '<p style="text-align: center; color: var(--tertiary-color);">Falha ao carregar os dados. Tente recarregar a página.</p>';
    }
}

// Carrega os dados assim que a página é carregada
document.addEventListener('DOMContentLoaded', carregarDados);