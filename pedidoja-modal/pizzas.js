// listaPizzas.js

var listaPizzas = [
    {
        nome: "Pizza de Calabresa",
        descricao: "Molho de tomate, queijo mussarela, calabresa fatiada, cebola e azeitonas pretas.",
        imagem: "./image/pizza-1.png",
        tamanhos: {
            pequena: 29.00,
            media: 30.00,
            grande: 35.00
        },
        adicionais: ["Cebola", "Azeitonas", "Orégano"],
        modalId: "modalPizza1"
    },
    {
        nome: "Pizza de Marguerita",
        descricao: "Molho de tomate, queijo mussarela, tomate fresco, manjericão e azeitonas verdes.",
        imagem: "./image/pizza-2.png",
        tamanhos: {
            pequena: 28.00,
            media: 33.00,
            grande: 38.00
        },
        adicionais: ["Tomate", "Manjericão", "Azeitonas", "Orégano"],
        modalId: "modalPizza2"
    }
    // Adicione outras pizzas conforme necessário
];

// Renderizar pizzas
function renderizarPizzas() {
    var listaPizzasHTML = document.getElementById("pizzas");

    listaPizzas.forEach(function (pizza, index) {
        var pizzaHTML = `
            <div class="col">
                <div class="card h-100">
                    <img src="${pizza.imagem}" class="card-img-top" alt="${pizza.nome}">
                    <div class="card-body">
                        <h5 class="card-title">${pizza.nome}</h5>
                        <p class="card-text">${pizza.descricao}</p>
                        <p class="card-text"><strong>Tamanhos e Preços:</strong></p>
                        <ul class="list-group list-group-flush">
        `;
        // Adiciona os tamanhos e preços
        for (var tamanho in pizza.tamanhos) {
            pizzaHTML += `<li class="list-group-item">${tamanho}: R$ ${pizza.tamanhos[tamanho].toFixed(2)}</li>`;
        }

        // Adiciona os adicionais
        pizzaHTML += `<p class="card-text"><strong>Adicionais:</strong></p><ul class="list-group list-group-flush">`;
        pizza.adicionais.forEach(function (adicional) {
            pizzaHTML += `<li class="list-group-item">${adicional}</li>`;
        });

        // Fecha a div da card-body
        pizzaHTML += `
                        </ul>
                    </div>
                    <div class="card-footer">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${pizza.modalId}">
                            Detalhes
                        </button>
                    </div>
                </div>
            </div>
        `;
        listaPizzasHTML.innerHTML += pizzaHTML;
    });
}

