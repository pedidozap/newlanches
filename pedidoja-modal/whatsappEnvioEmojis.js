// whatsappEnvio.js

document.addEventListener("DOMContentLoaded", function () {
    const concluirPedidoBtn = document.querySelector(".btn-fecharPedido");

    // Importa a função de gerar número do pedido
    const script = document.createElement("script");
    script.src = "./gerarNumeroPedido.js";
    document.head.appendChild(script);

    concluirPedidoBtn.addEventListener("click", function () {
        const tipoEntregaElement = document.querySelector('input[name="opcao"]:checked');
        if (!tipoEntregaElement) {
            alert("Por favor, selecione o tipo de entrega.");
            return;
        }

        const tipoEntrega = tipoEntregaElement.value;

        if (tipoEntrega === "entrega") {
            enviarPedidoEntrega();
        } else if (tipoEntrega === "balcao") {
            enviarPedidoBalcao();
        } else if (tipoEntrega === "mesa") {
            enviarPedidoMesa();
        } else {
            alert("Tipo de entrega inválido.");
        }
    });

    function agruparProdutos(produtos) {
        const produtosAgrupados = [];
        produtos.forEach(produto => {
            const nomeProdutoElement = produto.querySelector(".tituloProduto-item");
            const nomeProduto = nomeProdutoElement.textContent.split(":")[0].trim();

            let encontrado = false;
            produtosAgrupados.forEach(item => {
                if (item.nome === nomeProduto) {
                    item.quantidade++;
                    item.adicionais.push(...produto.querySelectorAll(".adicional-item"));
                    encontrado = true;
                }
            });

            if (!encontrado) {
                produtosAgrupados.push({
                    nome: nomeProduto,
                    quantidade: 1,
                    produto: produto,
                    adicionais: [...produto.querySelectorAll(".adicional-item")]
                });
            }
        });

        return produtosAgrupados;
    }

    function enviarPedidoEntrega() {
        const tipoEntregaElement = document.querySelector('input[name="opcao"]:checked');
        if (!tipoEntregaElement) {
            alert("Por favor, selecione o tipo de entrega.");
            return;
        }
    
        const tipoEntrega = tipoEntregaElement.value;
        let mensagem = "";
    
        let nomeCliente = "";
        let telefone = "";
    
        const nomeClienteElement = document.getElementById("nome");
        if (nomeClienteElement) {
            nomeCliente = nomeClienteElement.value || "";
        }
    
        const telefoneElement = document.getElementById("telefone");
        if (telefoneElement) {
            telefone = telefoneElement.value || "";
        }
    
        const enderecoElement = document.getElementById("endereco");
        const endereco = enderecoElement ? enderecoElement.value : "";
        const bairroElement = document.getElementById("bairro");
        const bairro = bairroElement ? bairroElement.options[bairroElement.selectedIndex].text : "";
        const referenciaElement = document.getElementById("referencia");
        const referencia = referenciaElement ? referenciaElement.value : "";
        const pagamentoElement = document.getElementById("pagamento");
        const pagamento = pagamentoElement ? pagamentoElement.value : "";
        const trocoElement = document.getElementById("troco");
        const troco = trocoElement ? trocoElement.value : "";
        const observacaoElement = document.getElementById("observacao");
        const observacao = observacaoElement ? observacaoElement.value : "";
    
        if (tipoEntrega === "entrega") {
            mensagem += "*Entrega! 🏍️💨*\n";
            mensagem += "-----------\n";
            mensagem += `😃: ${nomeCliente}\n`;
            mensagem += `📞 ${telefone}\n`;
            mensagem += `📍: ${endereco}\n`;
            mensagem += `🚩: ${bairro}\n`;
            mensagem += `⚠️: ${referencia}\n\n`;
        } else {
            mensagem += "*Retirada na Loja!*\n";
            mensagem += "--------------------\n";
            mensagem += `*Cliente:* ${nomeCliente}\n`;
            mensagem += `*Tel:* ${telefone}\n`;
        }

        // Gere o número do pedido
        const numeroPedido = gerarNumeroPedido();
        const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        mensagem += `*Pedido:* ${numeroPedido}\n`;
        mensagem += `🕐: ${dataHora}\n`;
        mensagem += ' --- \n';

        let pedidoTotal = 0;
        let adicionalTotal = 0;
        const produtosAgrupados = agruparProdutos(document.querySelectorAll("#pedido-item .pedido-card"));
        produtosAgrupados.forEach(produtoAgrupado => {
            const nomeProduto = produtoAgrupado.nome;
            const precoProduto = parseFloat(produtoAgrupado.produto.querySelector(".tituloProduto-item").textContent.split("R$ ")[1].replace(",", "."));
            const quantidadeProduto = produtoAgrupado.quantidade;
            const precoTotalProduto = precoProduto * quantidadeProduto;

            mensagem += `${quantidadeProduto.toString().padStart(2)} x ${nomeProduto} = R$ ${precoTotalProduto.toFixed(2)}\n`;
            pedidoTotal += precoTotalProduto;

            // Agrupa e soma os adicionais por tipo
            const adicionaisMap = new Map();
            produtoAgrupado.adicionais.forEach(adicionalElement => {
                const nomeAdicional = adicionalElement.textContent.split(":")[0].trim();
                const precoAdicional = parseFloat(adicionalElement.textContent.split("R$ ")[1].replace(",", "."));
                if (adicionaisMap.has(nomeAdicional)) {
                    adicionaisMap.set(nomeAdicional, {
                        quantidade: adicionaisMap.get(nomeAdicional).quantidade + 1,
                        preco: precoAdicional
                    });
                } else {
                    adicionaisMap.set(nomeAdicional, { quantidade: 1, preco: precoAdicional });
                }
            });

            adicionaisMap.forEach((value, key) => {
                const precoTotalAdicional = value.quantidade * value.preco;
                mensagem += `   ${value.quantidade.toString().padStart(2)} x Adc: ${key} = R$ ${precoTotalAdicional.toFixed(2)}\n`;
                adicionalTotal += precoTotalAdicional;
            });

            mensagem += ' --- \n';
        });

        if (observacao) {
            mensagem += `🔴 Obs: ${observacao}\n`;
            mensagem += ' --- \n';
        }

        mensagem += `*Pedido:* R$ ${pedidoTotal.toFixed(2)}\n`;
        mensagem += `*Adicionais:* R$ ${adicionalTotal.toFixed(2)}\n`;
        if (tipoEntrega === "entrega") {
            const taxaEntrega = 5.00; // Taxa de entrega para entrega
            mensagem += `*Taxa de Entrega:* R$ ${taxaEntrega.toFixed(2)}\n`;
            mensagem += `*Troco para:* R$ ${troco}\n`;
            mensagem += `*Form de Pagtº:* ${pagamento}\n\n`;
            const total = pedidoTotal + adicionalTotal + taxaEntrega;
            mensagem += `*Total:* R$ ${total.toFixed(2)}`;
        } else {
            const total = pedidoTotal + adicionalTotal;
            mensagem += `\n*Total:* R$ ${total.toFixed(2)}`;
        }

        console.log("Mensagem final:", mensagem);
        const linkWhatsApp = `https://api.whatsapp.com/send?phone=5521970129970&text=${encodeURIComponent(mensagem)}`;
        window.open(linkWhatsApp, "_blank");
    }

    function enviarPedidoBalcao() {
        const tipoEntregaElement = document.querySelector('input[name="opcao"]:checked');
        if (!tipoEntregaElement) {
            alert("Por favor, selecione o tipo de entrega.");
            return;
        }
    
        const tipoEntrega = tipoEntregaElement.value;
        let mensagem = "";
    
        let nomeCliente = "";
        let telefone = "";
    
        const nomeClienteElement = document.getElementById("nome");
        if (nomeClienteElement) {
            nomeCliente = nomeClienteElement.value || "";
        }
    
        const telefoneElement = document.getElementById("telefone");
        if (telefoneElement) {
            telefone = telefoneElement.value || "";
        }
    
        // const enderecoElement = document.getElementById("endereco");
        // const endereco = enderecoElement ? enderecoElement.value : "";
        // const bairroElement = document.getElementById("bairro");
        // const bairro = bairroElement ? bairroElement.options[bairroElement.selectedIndex].text : "";
        // const referenciaElement = document.getElementById("referencia");
        // const referencia = referenciaElement ? referenciaElement.value : "";
        // const pagamentoElement = document.getElementById("pagamento");
        // const pagamento = pagamentoElement ? pagamentoElement.value : "";
        // const trocoElement = document.getElementById("troco");
        // const troco = trocoElement ? trocoElement.value : "";
    
        if (tipoEntrega === "balcao") {
            mensagem += "*Retirada no Balcão!*\n";
            mensagem += "-----------\n";
            mensagem += `😃: ${nomeCliente}\n`;
            mensagem += `📞 ${telefone}\n`;

        } 
        // else {
        //     mensagem += "*Retirada na Loja!*\n";
        //     mensagem += "--------------------\n";
        //     mensagem += `*Cliente:* ${nomeCliente}\n`;
        //     mensagem += `*Tel:* ${telefone}\n`;
        // }

        // Gere o número do pedido
        const numeroPedido = gerarNumeroPedido();
        const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        mensagem += `*Pedido:* ${numeroPedido}\n`;
        mensagem += `🕐: ${dataHora}\n`;
        mensagem += ' --- \n';

        let pedidoTotal = 0;
        let adicionalTotal = 0;
        const produtosAgrupados = agruparProdutos(document.querySelectorAll("#pedido-item .pedido-card"));
        produtosAgrupados.forEach(produtoAgrupado => {
            const nomeProduto = produtoAgrupado.nome;
            const precoProduto = parseFloat(produtoAgrupado.produto.querySelector(".tituloProduto-item").textContent.split("R$ ")[1].replace(",", "."));
            const quantidadeProduto = produtoAgrupado.quantidade;
            const precoTotalProduto = precoProduto * quantidadeProduto;

            mensagem += `${quantidadeProduto.toString().padStart(2)} x ${nomeProduto} = R$ ${precoTotalProduto.toFixed(2)}\n`;
            pedidoTotal += precoTotalProduto;

            // Agrupa e soma os adicionais por tipo
            const adicionaisMap = new Map();
            produtoAgrupado.adicionais.forEach(adicionalElement => {
                const nomeAdicional = adicionalElement.textContent.split(":")[0].trim();
                const precoAdicional = parseFloat(adicionalElement.textContent.split("R$ ")[1].replace(",", "."));
                if (adicionaisMap.has(nomeAdicional)) {
                    adicionaisMap.set(nomeAdicional, {
                        quantidade: adicionaisMap.get(nomeAdicional).quantidade + 1,
                        preco: precoAdicional
                    });
                } else {
                    adicionaisMap.set(nomeAdicional, { quantidade: 1, preco: precoAdicional });
                }
            });

            adicionaisMap.forEach((value, key) => {
                const precoTotalAdicional = value.quantidade * value.preco;
                mensagem += `   ${value.quantidade.toString().padStart(2)} x Adc: ${key} = R$ ${precoTotalAdicional.toFixed(2)}\n`;
                adicionalTotal += precoTotalAdicional;
            });

            mensagem += ' --- \n';
        });

        mensagem += `*Produtos:* R$ ${pedidoTotal.toFixed(2)}\n`;
        mensagem += `*Adicionais:* R$ ${adicionalTotal.toFixed(2)}\n`;
        if (tipoEntrega === "balcao") {
            const taxaEntrega = 5.00; // Taxa de entrega para entrega
            const total = pedidoTotal + adicionalTotal;
            mensagem += `\n*Total:* R$ ${total.toFixed(2)}`;
        } else {
            const total = pedidoTotal + adicionalTotal;
            mensagem += `\n*Total:* R$ ${total.toFixed(2)}`;
        }

        console.log("Mensagem final:", mensagem);
        const linkWhatsApp = `https://api.whatsapp.com/send?phone=5521970129970&text=${encodeURIComponent(mensagem)}`;
        window.open(linkWhatsApp, "_blank");
    }
    
    function enviarPedidoMesa() {
        const tipoEntregaElement = document.querySelector('input[name="opcao"]:checked');
        if (!tipoEntregaElement) {
            alert("Por favor, selecione o tipo de entrega.");
            return;
        }
    
        const tipoEntrega = tipoEntregaElement.value;
        let mensagem = "";
    
        let nomeCliente = "";
        let mesa = "";
    
        const nomeClienteElement = document.getElementById("nomeMesa");
if (nomeClienteElement) {
    nomeCliente = nomeClienteElement.value || "";
}

const numeroMesaElement = document.getElementById("numeroMesa");
if (numeroMesaElement) {
    mesa = numeroMesaElement.value || "";
}

    
    
        if (tipoEntrega === "mesa") {
            mensagem += "*Entrega na Mesa!*\n";
            mensagem += "-----------\n";
            mensagem += `😃 *Clinte*: ${nomeCliente}\n`;
            mensagem += `🛎️ *Mesa:* ${mesa}\n`;
        }

        // Gere o número do pedido
        const numeroPedido = gerarNumeroPedido();
        const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        mensagem += `*Pedido:* ${numeroPedido}\n`;
        mensagem += `*Data e Hora:* ${dataHora}\n\n`;

        let pedidoTotal = 0;
        let adicionalTotal = 0;
        const produtosAgrupados = agruparProdutos(document.querySelectorAll("#pedido-item .pedido-card"));
        produtosAgrupados.forEach(produtoAgrupado => {
            const nomeProduto = produtoAgrupado.nome;
            const precoProduto = parseFloat(produtoAgrupado.produto.querySelector(".tituloProduto-item").textContent.split("R$ ")[1].replace(",", "."));
            const quantidadeProduto = produtoAgrupado.quantidade;
            const precoTotalProduto = precoProduto * quantidadeProduto;

            mensagem += `${quantidadeProduto.toString().padStart(2)} x ${nomeProduto} = R$ ${precoTotalProduto.toFixed(2)}\n`;
            pedidoTotal += precoTotalProduto;

            // Agrupa e soma os adicionais por tipo
            const adicionaisMap = new Map();
            produtoAgrupado.adicionais.forEach(adicionalElement => {
                const nomeAdicional = adicionalElement.textContent.split(":")[0].trim();
                const precoAdicional = parseFloat(adicionalElement.textContent.split("R$ ")[1].replace(",", "."));
                if (adicionaisMap.has(nomeAdicional)) {
                    adicionaisMap.set(nomeAdicional, {
                        quantidade: adicionaisMap.get(nomeAdicional).quantidade + 1,
                        preco: precoAdicional
                    });
                } else {
                    adicionaisMap.set(nomeAdicional, { quantidade: 1, preco: precoAdicional });
                }
            });

            adicionaisMap.forEach((value, key) => {
                const precoTotalAdicional = value.quantidade * value.preco;
                mensagem += `   ${value.quantidade.toString().padStart(2)} x Adc: ${key} = R$ ${precoTotalAdicional.toFixed(2)}\n`;
                adicionalTotal += precoTotalAdicional;
            });

            mensagem += ' --- \n';
        });

        mensagem += `*Produtos:* R$ ${pedidoTotal.toFixed(2)}\n`;
        mensagem += `*Adicionais:* R$ ${adicionalTotal.toFixed(2)}\n`;
        if (tipoEntrega === "mesa") {
            const total = pedidoTotal + adicionalTotal;
            mensagem += `\n*Total:* R$ ${total.toFixed(2)}`;
        }

        console.log("Mensagem final:", mensagem);
        const linkWhatsApp = `https://api.whatsapp.com/send?phone=5521970129970&text=${encodeURIComponent(mensagem)}`;
        window.open(linkWhatsApp, "_blank");
    }

});
