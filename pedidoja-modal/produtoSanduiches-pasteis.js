// produtoSanduiches.js

document.addEventListener("DOMContentLoaded", function () {
  var produtosScript = document.createElement("script");
  produtosScript.src = "produtos.js";
  document.head.appendChild(produtosScript);

  var precosScript = document.createElement("script");
  precosScript.src = "precos.js";
  document.head.appendChild(precosScript);

  produtosScript.onload = function () {
    precosScript.onload = function () {
      criarProdutos();
      criarModais();
    };
  };

  function criarProdutos() {
    var tbodySanduiches = document.getElementById("produtos-lista");
    var tbodyBebidas = document.getElementById("bebidas-lista");
    var tbodyPasteis = document.getElementById("pasteis-lista");

    listaProdutos.forEach(function (produto, index) {
      var tr = criarLinhaProduto(produto, index);
      tbodySanduiches.appendChild(tr);
    });

    listaProdutosBebidas.forEach(function (produto, index) {
      var tr = criarLinhaProduto(produto, index, "bebida");
      tbodyBebidas.appendChild(tr);
    });

    listaProdutosPasteis.forEach(function (produto, index) {
      var tr = criarLinhaProduto(produto, index, "pastel");
      tbodyPasteis.appendChild(tr);
    });
  }

  function criarLinhaProduto(produto, index, tipo = "sanduiche") {
    var preco = precos[produto.nome];
    var modalId = tipo === "sanduiche" ? "modal-" + index : tipo === "bebida" ? "modal-bebida-" + index : "modal-pastel-" + index;
    produto.modalId = modalId;

    var tr = document.createElement("tr");
    tr.setAttribute("data-bs-toggle", "modal");
    tr.setAttribute("data-bs-target", "#" + modalId);
    tr.innerHTML = `
        <td><img src="${produto.imagem}" alt="${produto.nome}" class="img-thumbnail"></td>
        <td>
            <h5>${produto.nome}</h5>
            <p>${produto.descricao}</p>
        </td>
        <td class="price">R$ ${preco.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}</td>
        <td>
            <a href="#" data-bs-toggle="modal" data-bs-target="#${modalId}">
                <img src="./image/adicionaCarrinho.png" alt="Adicionar ao Carrinho">
            </a>
        </td>
    `;
    return tr;
  }

  function criarModais() {
    listaProdutos.concat(listaProdutosBebidas, listaProdutosPasteis).forEach(function (produto) {
      var modal = document.createElement("div");
      var preco = precos[produto.nome];
      modal.classList.add("modal", "fade");
      modal.setAttribute("id", produto.modalId);
      modal.setAttribute("tabindex", "-1");
      modal.setAttribute("aria-labelledby", "exampleModalLabel");
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${produto.nome}</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${produto.imagem}" alt="Imagem do Produto" class="img-fluid">
                        </div>
                        <div class="col-md-6">
                            <p><span class="subtotal-label">${produto.nome}:</span> R$ ${preco.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}</p>
                            ${produto.adicionais ? `<h6>Adicionais:</h6>${criarListaAdicionais(produto.adicionais, produto.modalId)}<br/>` : ""}
                            <div class="mb-3">
                                <p><span class="subtotal-label">Subtotal:</span> R$ <span id="subtotal-${produto.modalId}">${preco.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}</span></p>
                            </div>
                            <div class="mb-3">
                                <label for="observacao" class="form-label">Observação:</label>
                                <textarea class="form-control" id="observacao-${produto.modalId}" rows="3"></textarea>
                            </div>
                            <button type="button" class="btn btn-primary btn-adicionar-pedido" data-nome="${produto.nome}" data-preco="${preco}">Adicionar Pedido</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `;
      document.body.appendChild(modal);

      var subtotalSpan = document.getElementById("subtotal-" + produto.modalId);

      function atualizarSubtotal() {
        var subtotal = preco;
        modal.querySelectorAll(".form-check-input:checked").forEach(function (checkbox) {
          var adicionalPreco = parseFloat(checkbox.getAttribute("data-preco"));
          subtotal += adicionalPreco;
        });
        subtotalSpan.textContent = subtotal.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }

      modal.querySelectorAll(".form-check-input").forEach(function (checkbox) {
        checkbox.addEventListener("change", atualizarSubtotal);
      });

      var btnAdicionarPedido = modal.querySelector(".btn-adicionar-pedido");
      btnAdicionarPedido.addEventListener("click", function () {
        var observacao = modal.querySelector("#observacao-" + produto.modalId).value;
        var adicionaisSelecionados = [];
        var adicionaisPrecos = [];
        modal.querySelectorAll(".form-check-input:checked").forEach(function (checkbox) {
          var adicional = checkbox.nextElementSibling.textContent.trim().split("+")[0].trim();
          var adicionalPreco = parseFloat(checkbox.getAttribute("data-preco"));
          adicionaisSelecionados.push(adicional);
          adicionaisPrecos.push(adicionalPreco);
        });

        var subtotal = parseFloat(subtotalSpan.textContent.replace(",", "."));
        adicionarPedido(produto.nome, preco, adicionaisSelecionados, adicionaisPrecos, subtotal, observacao);

        var bsModal = bootstrap.Modal.getInstance(modal);
        bsModal.hide();
      });
    });
  }
  
  function criarListaAdicionais(adicionais, modalId) {
    var listaHtml = "";
    adicionais.forEach(function (item) {
      var precoAdicional = precos[item];
      listaHtml += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${item}" data-preco="${precoAdicional}" id="${item.toLowerCase()}-${modalId}">
                <label class="form-check-label" for="${item.toLowerCase()}-${modalId}">
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

  function atualizarContador() {
    const pedidoItems = document.querySelectorAll("#pedido-item .pedido-item");
    const contadorBadge = document.querySelector(".btnFlutuante-bolsa .badge");
    contadorBadge.textContent = pedidoItems.length;
  }

  function adicionarPedido(nome, preco, adicionaisSelecionados, adicionaisPrecos, subtotal, observacao) {
    var seuPedido = document.getElementById("pedido-item");

    if (seuPedido) {
      var novoPedido = document.createElement("div");
      novoPedido.classList.add("pedido-item");

      var adicionaisHtml = "";
      adicionaisSelecionados.forEach(function (adicional, index) {
        adicionaisHtml += `<p>+ ${adicional}: R$ ${adicionaisPrecos[index].toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}</p>`;
      });

      novoPedido.innerHTML = `
          <p>${nome}: R$ ${preco.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</p>
          ${adicionaisHtml}
          <p>Subtotal: R$ ${subtotal.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</p>
          <p>Obs: ${observacao ? observacao : "Não"}</p>
          <button type="button" class="btn btn-danger btn-remover-pedido">Remover Item</button>
      `;

      seuPedido.appendChild(novoPedido);

      novoPedido.querySelector(".btn-remover-pedido").addEventListener("click", function () {
        seuPedido.removeChild(novoPedido);
        atualizarContador(); // Atualiza o contador ao remover um pedido
      });

      atualizarContador(); // Atualiza o contador ao adicionar um pedido
    } else {
      console.error("Elemento 'pedido-item' não encontrado no DOM.");
    }
  }
});
