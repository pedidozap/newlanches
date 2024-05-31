// produtoPizza.js

document.addEventListener("DOMContentLoaded", function () {

  function criarProdutosPizzas() {
    var tbody = document.getElementById("pizzas-lista");
    listaPizzas.forEach(function (pizza) {
      var tr = document.createElement("tr");
      var precoMinimo = Math.min(...Object.values(pizza.tamanhos)); // Obter o preço mínimo da pizza
      tr.setAttribute("data-bs-toggle", "modal");
      tr.setAttribute("data-bs-target", "#" + pizza.modalId);
      tr.innerHTML = `
            <td class="align-middle text-center"><img src="${pizza.imagem}" alt="${pizza.nome}"></td>
            <td class="align-middle text-start">
                <h5>${pizza.nome}</h5>
                <p>${pizza.descricao}</p>
            </td>
            <td class="align-middle text-center price">R$ ${precoMinimo.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</td>
            <td class="align-middle text-center">
                <a href="#" data-bs-toggle="modal" data-bs-target="#${
                  pizza.modalId
                }">
                    <img src="./image/adicionaCarrinho.png" alt="Adicionar ao Carrinho">
                </a>
            </td>
        `;
      tbody.appendChild(tr);
    });
  }

  function criarModaisPizzas() {
    listaPizzas.forEach(function (pizza) {
        var modal = document.createElement("div");
        modal.classList.add("modal", "fade");
        modal.setAttribute("id", pizza.modalId);
        modal.setAttribute("tabindex", "-1");
        modal.setAttribute("aria-labelledby", "exampleModalLabel");
        modal.setAttribute("aria-hidden", "true");
        var modalContent = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">${pizza.nome}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="${pizza.imagem}" alt="Imagem da Pizza" class="img-fluid">
                            </div>
                            <div class="col-md-6">
                                <h6>Escolha o tamanho:</h6>
                                <select id="tamanho-${pizza.modalId}" class="form-select">
                                    ${Object.entries(pizza.tamanhos).map(([tamanho, preco]) =>
                                        `<option value="${tamanho}" data-preco="${preco}" ${tamanho === "Pequena" ? "selected" : ""}>${tamanho}: R$ ${preco.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</option>`
                                    ).join("")}
                                </select>
                                <br/>
                                <h6>Adicionais:</h6>
                                ${criarListaAdicionais(pizza.adicionais)}
                                <br/>
                                <div class="mb-3">
                                    <p><span class="subtotal-label">Subtotal:</span> R$ <span class="subtotal" id="subtotal-${pizza.modalId}">0,00</span></p>
                                </div>
                                <button type="button" class="btn btn-primary btn-adicionar-pedido">Adicionar Pedido</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);

        var tamanhoSelect = modal.querySelector(`#tamanho-${pizza.modalId}`);
        var subtotalSpan = modal.querySelector(`#subtotal-${pizza.modalId}`);

        // Função para calcular o subtotal
        function calcularSubtotal() {
            var precoTamanho = parseFloat(tamanhoSelect.options[tamanhoSelect.selectedIndex].getAttribute("data-preco"));
            var precoAdicionais = 0;
            modal.querySelectorAll(".adicional:checked").forEach(function (checkbox) {
                precoAdicionais += parseFloat(checkbox.value);
            });
            var subtotal = precoTamanho + precoAdicionais;
            subtotalSpan.textContent = subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Atualizar subtotal ao abrir o modal
        modal.addEventListener("shown.bs.modal", calcularSubtotal);

        // Adicionar eventos de mudança para atualizar o subtotal
        tamanhoSelect.addEventListener("change", calcularSubtotal);
        modal.querySelectorAll(".adicional").forEach(function (checkbox) {
            checkbox.addEventListener("change", calcularSubtotal);
        });

        // Adicionar pedido e fechar o modal
        modal.querySelector(".btn-adicionar-pedido").addEventListener("click", function () {
            var tamanhoSelecionado = tamanhoSelect.options[tamanhoSelect.selectedIndex].textContent;
            var subtotal = parseFloat(subtotalSpan.textContent.replace(",", "."));
            var adicionaisSelecionados = Array.from(modal.querySelectorAll(".adicional:checked")).map(function (checkbox) {
                var label = checkbox.nextElementSibling.textContent.trim();
                var adicionalNome = label.split(" +")[0].trim();
                var adicionalPreco = parseFloat(checkbox.value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                return { nome: adicionalNome, preco: adicionalPreco };
            });

            adicionarPedido(pizza.nome, tamanhoSelecionado, adicionaisSelecionados, subtotal);

            var bsModal = bootstrap.Modal.getInstance(modal);
            bsModal.hide();
        });
    });
}

  function criarListaAdicionais(adicionais) {
    var listaHtml = "";
    adicionais.forEach(function (item) {
      var precoAdicional = precos[item];
      listaHtml += `
                <div class="form-check">
                    <input class="form-check-input adicional" type="checkbox" value="${precoAdicional}" id="${item.toLowerCase()}">
                    <label class="form-check-label" for="${item.toLowerCase()}">
                        ${item} + R$ ${precoAdicional.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
                    </label>
                </div>
            `;
    });
    return listaHtml;
  }

  function adicionarPedido(nome, tamanho, adicionais, subtotal, observacao) {
    var seuPedido = document.getElementById("pedido-item");
  
    if (seuPedido) {
      var novoPedido = document.createElement("div");
      novoPedido.classList.add("pedido-card");
  
      var adicionaisHtml = adicionais
        .map(function (adicional) {
          return `<p class="adicional-item">+ ${adicional.nome}: R$ ${adicional.preco}</p>`;
        })
        .join("");
  
      novoPedido.innerHTML = `
      <div class="pedido-conteudo">
          <p class="tituloProduto-item">${nome} ${tamanho}</p>
          ${adicionaisHtml}
          <p class="subtotal-item">Subtotal: R$ ${subtotal.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</p>
          ${observacao ? `<p>Obs: ${observacao}</p>` : ""}
      </div>
      <div class="pedido-botao">
          <button type="button" class="btn btn-danger btn-remover-pedido">Remover Item</button>
      </div>
      `;
  
      seuPedido.appendChild(novoPedido);
  
      novoPedido
        .querySelector(".btn-remover-pedido")
        .addEventListener("click", function () {
          seuPedido.removeChild(novoPedido);
          atualizarContador(); // Atualiza o contador ao remover um pedido
        });
  
      atualizarContador(); // Atualiza o contador ao adicionar um pedido
    } else {
      console.error("Elemento 'pedido-item' não encontrado no DOM.");
    }
}


  criarProdutosPizzas();
  criarModaisPizzas();
});

