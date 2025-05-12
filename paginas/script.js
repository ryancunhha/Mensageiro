document.addEventListener("DOMContentLoaded", () => {
    fetch("status.json?" + new Date().getTime())  // Adiciona um timestamp para evitar cache
        .then(res => res.json())  // Lê o JSON
        .then(data => {
            console.log("Dados carregados:", data);  // Debug para ver se os dados estão corretos
            const disponiveis = data.casas_disponiveis;  // Pega as casas disponíveis
            const allButtons = document.querySelectorAll("button[id^='casa-']");  // Todos os botões de casa

            allButtons.forEach(button => {
                const casaId = button.id.split("-")[1];  // Extrai o número da casa (1, 2, 3, ...)
                if (disponiveis.includes(parseInt(casaId))) {
                    button.style.opacity = "1";  // Torna o botão visível
                    button.style.pointerEvents = "auto";  // Torna o botão clicável
                } else {
                    button.style.opacity = "0";  // Torna o botão invisível
                    button.style.pointerEvents = "none";  // Torna o botão não clicável
                }
            });
        })
        .catch(err => console.error("Erro ao carregar status.json:", err));  // Se der erro, mostre no console
});
