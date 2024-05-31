// gerarNumeroPedido.js

const NUMERO_PEDIDO_KEY = "numeroPedido";
const DATA_PEDIDO_KEY = "dataPedido";

function obterDataAtualFormatada() {
    const dataAtual = new Date();
    return `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}-${String(dataAtual.getDate()).padStart(2, '0')}`;
}

function inicializarNumeroPedido() {
    const dataAtualFormatada = obterDataAtualFormatada();
    const dataPedidoArmazenada = localStorage.getItem(DATA_PEDIDO_KEY);

    if (dataPedidoArmazenada !== dataAtualFormatada) {
        localStorage.setItem(DATA_PEDIDO_KEY, dataAtualFormatada);
        localStorage.setItem(NUMERO_PEDIDO_KEY, "1");
    }
}

function gerarNumeroPedido() {
    inicializarNumeroPedido();

    let numeroPedido = parseInt(localStorage.getItem(NUMERO_PEDIDO_KEY), 10);
    const dataAtualFormatada = obterDataAtualFormatada();

    localStorage.setItem(NUMERO_PEDIDO_KEY, (numeroPedido + 1).toString());
    return `${dataAtualFormatada.replace(/-/g, '')}-${numeroPedido}`;
}

// Exemplo de uso
console.log(gerarNumeroPedido());
