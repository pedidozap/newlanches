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

    listaProdutos.forEach(function (produto, index) {
      var tr = criarLinhaProduto(produto, index);
      tbodySanduiches.appendChild(tr);
    });

    listaProdutosBebidas.forEach(function (produto, index) {
      var tr = criarLinhaProduto(produto, index, "bebida");
      tbodyBebidas.appendChild(tr);
    });
  }

  function criarLinhaProduto(produto, index, tipo = "sanduiche") {
    var preco = precos[produto.nome];
    var modalId =
      tipo === "sanduiche" ? "modal-" + index : "modal-bebida-" + index;
    produto.modalId = modalId;

    var tr = document.createElement("tr");
    tr.setAttribute("data-bs-toggle", "modal");
    tr.setAttribute("data-bs-target", "#" + modalId);
    tr.innerHTML = `
        <td class="align-middle text-center"><img src="${
          produto.imagem
        }" alt="${produto.nome}" class="img-fluid"></td>
        <td class="align-middle text-start">
            <h5>${produto.nome}</h5>
            <p>${produto.descricao}</p>
        </td>
        <td class="align-middle text-center price">R$ ${preco.toLocaleString(
          "pt-BR",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}</td>
        <td class="align-middle text-center">
            <a href="#" data-bs-toggle="modal" data-bs-target="#${modalId}">
                <img src="./image/adicionaCarrinho.png" alt="Adicionar ao Carrinho">
            </a>
        </td>
    `;
    return tr;
  }

  function criarModais() {
    listaProdutos.concat(listaProdutosBebidas).forEach(function (produto) {
        var modal = document.createElement("div");
        var preco = precos[produto.nome];
        modal.classList.add("modal", "fade");
        modal.setAttribute("id", produto.modalId);
        modal.setAttribute("tabindex", "-1");
        modal.setAttribute("aria-labelledby", "exampleModalLabel");
        modal.setAttribute("aria-hidden", "true");

        // Verifica se há adicionais cadastrados
        var temAdicionais = produto.adicionais && produto.adicionais.length > 0;

        modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${
                      produto.nome
                    }</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${
                              produto.imagem
                            }" alt="Imagem do Produto" class="img-fluid">
                        </div>
                        <div class="col-md-6">
                            <p><span class="subtotal-label">${
                              produto.nome
                            }:</span> R$ ${preco.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}</p>
                            ${
                              temAdicionais
                                ? `<h6>Adicionais:</h6>${criarListaAdicionais(
                                    produto.adicionais,
                                    produto.modalId
                                  )}<br/>`
                                : ""
                            }
                            ${
                              temAdicionais
                                ? `
                            <div class="mb-3" id="subtotal-container-${
                              produto.modalId
                            }">
                                <p><span class="subtotal-label">Subtotal:</span> R$ <span id="subtotal-${
                                  produto.modalId
                                }">${preco.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}</span></p>
                            </div>`
                                : ""
                            }
                            <button type="button" class="btn btn-primary btn-adicionar-pedido" data-nome="${
                              produto.nome
                            }" data-preco="${preco}">Adicionar Pedido</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `;
        document.body.appendChild(modal);

        var subtotalSpan = document.getElementById("subtotal-" + produto.modalId);
        var subtotalContainer = document.getElementById(
          "subtotal-container-" + produto.modalId
        );

        function atualizarSubtotal() {
            var subtotal = preco;
            modal
              .querySelectorAll(".form-check-input:checked")
              .forEach(function (checkbox) {
                var adicionalPreco = parseFloat(
                  checkbox.getAttribute("data-preco")
                );
                subtotal += adicionalPreco;
              });
            if (subtotalSpan) {
              subtotalSpan.textContent = subtotal.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
            }

            if (subtotalContainer) {
              if (temAdicionais) {
                subtotalContainer.style.display = "block";
              } else {
                subtotalContainer.style.display = "none";
              }
            }
        }

        modal.querySelectorAll(".form-check-input").forEach(function (checkbox) {
            checkbox.addEventListener("change", atualizarSubtotal);
        });

        var btnAdicionarPedido = modal.querySelector(".btn-adicionar-pedido");
        btnAdicionarPedido.addEventListener("click", function () {
            var adicionaisSelecionados = [];
            var adicionaisPrecos = [];
            modal
              .querySelectorAll(".form-check-input:checked")
              .forEach(function (checkbox) {
                var adicional = checkbox.nextElementSibling.textContent
                  .trim()
                  .split("+")[0]
                  .trim();
                var adicionalPreco = parseFloat(
                  checkbox.getAttribute("data-preco")
                );
                adicionaisSelecionados.push(adicional);
                adicionaisPrecos.push(adicionalPreco);
              });

            var subtotal = preco;
            if (subtotalSpan) {
              subtotal = parseFloat(subtotalSpan.textContent.replace(",", "."));
            }

            adicionarPedido(
              produto.nome,
              preco,
              adicionaisSelecionados,
              adicionaisPrecos,
              subtotal
            );

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

   function adicionarPedido(nome, preco, adicionaisSelecionados, adicionaisPrecos, subtotal) {
    var seuPedido = document.getElementById("pedido-item");

    if (seuPedido) {
        var novoPedido = document.createElement("div");
        novoPedido.classList.add("pedido-card");

        var adicionaisHtml = "";
        adicionaisSelecionados.forEach(function (adicional, index) {
            adicionaisHtml += `<p class="adicional-item">+ ${adicional}: R$ ${adicionaisPrecos[index].toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}</p>`;
        });

        novoPedido.innerHTML = `
        <div class="pedido-conteudo">
            <p class="tituloProduto-item">${nome}: R$ ${preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}</p>
            ${adicionaisHtml}
            <p class="subtotal-item">Subtotal: R$ ${subtotal.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}</p>
        </div>
        <div class="pedido-botao">
            <button type="button" class="btn btn-danger btn-remover-pedido">Remover Item</button>
        </div>
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

  function limparPedidos() {
    var pedidoItem = document.getElementById("pedido-item");
    if (pedidoItem) {
      pedidoItem.innerHTML = ""; // Remove todos os elementos dentro de pedidoItem
      atualizarContador();
    }
  }

  // Adicionando evento de clique ao botão "Limpar Pedido"
  var btnLimparPedido = document.querySelector(".btn-warning");
  btnLimparPedido.addEventListener("click", limparPedidos);


});

