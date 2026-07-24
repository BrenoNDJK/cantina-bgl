const API = "http://localhost:3000";

// Carrega o cardápio quando a página abre
window.onload = carregarCardapio;

// ===========================
// ADICIONAR COMIDA
// ===========================

async function adicionar() {

    const dia = document.getElementById("dia").value;
    const comida = document.getElementById("comida").value;

    if (comida.trim() == "") {
        alert("Digite o nome da comida.");
        return;
    }

    await fetch(API + "/cardapio", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            dia,
            comida

        })

    });

    document.getElementById("comida").value = "";

    carregarCardapio();

}

// ===========================
// CARREGAR CARDÁPIO
// ===========================

async function carregarCardapio() {

    const resposta = await fetch(API + "/cardapio");

    const dados = await resposta.json();

    const lista = document.getElementById("lista");

    lista.innerHTML = "";

    dados.forEach(item => {

        lista.innerHTML += `

        <div class="produto">

            <h2>${item.comida}</h2>

            <p>${item.dia}</p>

            <button onclick="editar(${item.id}, '${item.dia}', '${item.comida}')">
                Editar
            </button>

            <button onclick="excluir(${item.id})">
                Excluir
            </button>

        </div>

        `;

    });

}

// ===========================
// EDITAR
// ===========================

async function editar(id, diaAtual, comidaAtual) {

    const novaComida = prompt("Novo nome da comida:", comidaAtual);

    if (!novaComida) return;

    const novoDia = prompt("Novo dia:", diaAtual);

    if (!novoDia) return;

    await fetch(API + "/cardapio/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            comida: novaComida,

            dia: novoDia

        })

    });

    carregarCardapio();

}

// ===========================
// EXCLUIR
// ===========================

async function excluir(id) {

    if (!confirm("Deseja excluir essa comida?")) return;

    await fetch(API + "/cardapio/" + id, {

        method: "DELETE"

    });

    carregarCardapio();

}