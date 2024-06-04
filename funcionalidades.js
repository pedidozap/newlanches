// funcionalidades.js
// Função que gera o icone de MENU para link com categorias

document.addEventListener("DOMContentLoaded", function () {
    // Seleciona todos os links dentro do modal
    var modalLinks = document.querySelectorAll("#navModal a");

    // Adiciona um ouvinte de eventos para cada link
    modalLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            // Impede o comportamento padrão do link
            event.preventDefault();

            // Fecha o modal após um pequeno atraso para que o usuário veja a animação
            setTimeout(function () {
                var modal = document.querySelector("#navModal");
                var modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
            }, 300); // Ajuste o valor conforme necessário

            // Navega para a categoria correspondente
            var category = link.getAttribute("data-category");
            var categoryElement = document.getElementById(category);
            if (categoryElement) {
                categoryElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});


