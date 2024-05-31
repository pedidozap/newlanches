// dadosLoja.js


const lojaInfo = {
    endereco: "Rua Exemplo, 123 - Centro",
    horarios: "Previsão de retirada: 20-30 minutos",
    previsaoEntrega: {
        pizza: 30,
        lanche: 20,
        bebida: 10,
    },
    calcularPrevisao: function (tipo, quantidade) {
        if (this.previsaoEntrega[tipo]) {
            return this.previsaoEntrega[tipo] * quantidade;
        }
        return 30; // Valor padrão se não encontrar o tipo
    }
};
