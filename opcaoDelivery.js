// opcaoDelivery.js

document.addEventListener("DOMContentLoaded", function () {
  const tipoEntregaRadios = document.querySelectorAll('input[name="opcao"]');
  const formularioContainer = document.getElementById("formulario-container");

  // Função para criar o formulário de entrega
  function criarFormularioEntrega() {
    const formulario = document.createElement("div");
    formulario.innerHTML = `
          <div class="mb-3">
              <label for="nome" class="form-label">Nome:</label>
              <input type="text" class="form-control" id="nome" required>
          </div>
          <div class="mb-3">
            <label for="telefone" class="form-label">Telefone:</label>
            <input type="tel" class="form-control" id="telefone" pattern="\\([0-9]{2}\\)[0-9]{8,9}" required>
            <div class="invalid-feedback">Por favor, insira um telefone válido com DDD</div>
          </div>
          <div class="mb-3">
              <label for="endereco" class="form-label">Endereço:</label>
              <input type="text" class="form-control" id="endereco" required>
          </div>
          <div class="mb-3">
                <label for="bairro" class="form-label">Bairro:</label>
                <select class="form-select" id="bairro" required>
                    <option value="">Selecione um bairro</option>
                    ${bairros
        .map(
          (bairro) =>
            `<option value="${bairro.nome}" data-taxa="${bairro.taxa}">${bairro.nome}</option>`
        )
        .join("")}
                </select>
                <span id="taxa-entrega" style="font-size: 12px; color: red; font-style: italic;"></span>
            </div>
          <div class="mb-3">
              <label for="referencia" class="form-label">Ponto de Referência:</label>
              <input type="text" class="form-control" id="referencia">
          </div>
          <div class="mb-3">
              <label for="pagamento" class="form-label">Forma de Pagamento:</label>
              <select class="form-select" id="pagamento" required>
                  <option value="">Selecione uma opção</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao">Cartão</option>
                  <option value="pix">Pix</option>
              </select>
          </div>
          <div id="troco-field" class="mb-3 hidden">
              <label for="troco" class="form-label">Troco para:</label>
              <input type="text" class="form-control" id="troco">
          </div>
          <div class="mb-3">
              <label for="observacao" class="form-label">Observação:</label>
              <textarea class="form-control" id="observacao"></textarea>
          </div>
      `;
    formularioContainer.appendChild(formulario);

    // Adicionar evento de mudança para o select de forma de pagamento
    const trocoField = document.getElementById("troco-field");
    const pagamentoSelect = document.getElementById("pagamento");
    pagamentoSelect.addEventListener("change", function () {
      if (this.value === "dinheiro") {
        trocoField.classList.remove("hidden");
      } else {
        trocoField.classList.add("hidden");
      }
    });

    // Adicionar evento de mudança para o select de bairro
    document.getElementById("bairro").addEventListener("change", function () {
      const selectedOption = this.options[this.selectedIndex];
      const taxaEntrega = selectedOption.getAttribute("data-taxa");
      document.getElementById("taxa-entrega").textContent = taxaEntrega
        ? `Taxa de entrega é de: R$ ${taxaEntrega}`
        : "";
    });
  }

  // Função para criar o formulário de retirada no balcão
  function criarFormularioRetirada() {
    const formulario = document.createElement("div");
    formulario.innerHTML = `
    <div class="mb-3">
      <label for="nome" class="form-label">Nome:</label>
      <input type="text" class="form-control" id="nome" required>
    </div>
      <div class="mb-3">
      <label for="telefone" class="form-label">Telefone:</label>
      <input type="text" class="form-control" id="telefone" required>
    </div>
      `;
    formularioContainer.appendChild(formulario);
  }

  function criarFormularioMesa() {
    const formulario = document.createElement("div");
    formulario.innerHTML = `
        <div class="mb-3">
            <label for="nomeMesa" class="form-label">Nome:</label>
            <input type="text" class="form-control" id="nomeMesa" required>
        </div>
        <div class="mb-3">
            <label for="numeroMesa" class="form-label">Número da Mesa:</label>
            <input type="text" class="form-control" id="numeroMesa" required>
        </div>
    `;
    formularioContainer.appendChild(formulario);
}


  // Adicionar evento de mudança para os radios de tipo de entrega
  tipoEntregaRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      // Limpar formulários anteriores
      formularioContainer.innerHTML = "";

      if (this.value === "entrega") {
        criarFormularioEntrega();
      } else if (this.value === "balcao") {
        criarFormularioRetirada();
      } else if (this.value === "mesa") {
        criarFormularioMesa();
      }
    });
  });
});
