// resumoPedido.js

function atualizarContador() {
    const pedidoItems = document.querySelectorAll("#pedido-item .pedido-card");
    const contadorBadge = document.querySelector(".btnFlutuante-bolsa .badge");
    contadorBadge.textContent = pedidoItems.length;
}

document.addEventListener("DOMContentLoaded", function() {
    const verificarPedidoBtn = document.getElementById("verificarPedidoBtn");
    const resumoPedidoTxt = document.getElementById("resumoPedidoTxt");
    const tipoEntregaRadios = document.querySelectorAll('input[name="opcao"]');
    const pedidoContainer = document.getElementById("pedido-item");

    function calcularValores() {
        let pedidoTotal = 0;
        let adicionaisTotal = 0;
        let taxaEntrega = 0;

        const produtos = document.querySelectorAll("#pedido-item .pedido-card");
        produtos.forEach(produto => {
            const precoProdutoElement = produto.querySelector(".tituloProduto-item");
            if (precoProdutoElement) {
                const precoProduto = parseFloat(precoProdutoElement.textContent.split("R$ ")[1].replace(",", "."));
                pedidoTotal += precoProduto;
            }

            const adicionais = produto.querySelectorAll(".adicional-item");
            adicionais.forEach(adicional => {
                if (adicional.textContent.includes("+")) {
                    const precoAdicional = parseFloat(adicional.textContent.split("R$ ")[1].replace(",", "."));
                    adicionaisTotal += precoAdicional;
                }
            });
        });

        const bairroSelect = document.getElementById("bairro");
        if (bairroSelect) {
            const bairroSelecionado = bairroSelect.options[bairroSelect.selectedIndex];
            if (bairroSelecionado) {
                taxaEntrega = parseFloat(bairroSelecionado.getAttribute("data-taxa")) || 0;
            }
        }

        const total = pedidoTotal + adicionaisTotal + taxaEntrega;

        document.getElementById("pedidoValor").innerText = `Pedido: R$ ${pedidoTotal.toFixed(2)}`;
        document.getElementById("adicionaisValor").innerText = `Adicionais: R$ ${adicionaisTotal.toFixed(2)}`;
        document.getElementById("taxaEntregaValor").innerText = `Taxa de Entrega: R$ ${taxaEntrega.toFixed(2)}`;
        document.getElementById("totalValor").innerText = `Total: R$ ${total.toFixed(2)}`;
        
        // Tornando os valores acessíveis globalmente
        window.pedidoTotal = pedidoTotal;
        window.adicionaisTotal = adicionaisTotal;
        window.taxaEntrega = taxaEntrega;
        window.total = total;
    }

    window.calcularValores = calcularValores;


    verificarPedidoBtn.addEventListener("click", function() {
        const entregaSelecionada = document.querySelector('input[name="opcao"]:checked');
        if (!entregaSelecionada) {
            alert("Por favor, selecione o tipo de entrega.");
            return;
        }
    
        // Verifica se o tipo de entrega selecionado é "Retirada no Balcão"
        if (entregaSelecionada.value === "balcao") {
            const nomeCliente = document.getElementById("nome").value.trim();
            const telefone = document.getElementById("telefone").value.trim();
    
            // Verifica se os campos de nome e telefone estão preenchidos
            if (!nomeCliente || !telefone) {
                alert("Por favor, preencha o nome e o telefone para retirada no balcão.");
                return;
            }
        }
    
        // Se tudo estiver preenchido corretamente, continua o processo de verificação do pedido
        if (entregaSelecionada.value === "entrega") {
            const bairroSelect = document.getElementById("bairro");
            if (!bairroSelect || !bairroSelect.value) {
                alert("Por favor, selecione o bairro para entrega.");
                return;
            }
        }
    
        resumoPedidoTxt.classList.remove("hidden");
        calcularValores();
        atualizarContador(); // Atualiza o contador ao verificar o pedido
    });
    
    tipoEntregaRadios.forEach((radio) => {
        radio.addEventListener("change", function() {
            resumoPedidoTxt.classList.add("hidden");
        });
    });

    document.addEventListener("change", function(event) {
        if (event.target && event.target.id === "bairro") {
            resumoPedidoTxt.classList.add("hidden");
        }
    });

    var btnLimparPedido = document.querySelector(".btn-warning");
    btnLimparPedido.addEventListener("click", function() {
        limparPedidos();
        pedidoContainer.removeEventListener("DOMNodeInserted", atualizarContador);
        pedidoContainer.removeEventListener("DOMNodeRemoved", atualizarContador);
    });

    function limparPedidos() {
        var pedidoItem = document.getElementById("pedido-item");
        if (pedidoItem) {
            pedidoItem.innerHTML = ""; // Remove todos os elementos dentro de pedidoItem
            atualizarContador();
        }
    }
});

