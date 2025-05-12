const LIMITE = 2;
const BLOQUEIO_5 = 5 * 60 * 1000;
const BLOQUEIO_10 = 10 * 60 * 1000;

function mostrarPopup(texto, tipo = "success") {
    const popup = document.getElementById('popup');
    popup.textContent = texto;
    popup.className = tipo === "success" ? "popup-success" : "popup-error", "avisoNome";
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 1200);
}

function chamarPessoas() {
    const input = document.getElementById('mensagem');
    const aviso = document.getElementById('aviso');
    input.value = "Chamando no Portão: "; // quando clica no botão chamar alguem vai aparecer um promt 
    input.focus();
    mostrarPopup("⚠️ Digite o nome da pessoa!", "sucess"); // aviso pra continuar escrever no promt
    aviso.style.display = 'block';
    setTimeout(() => {
        aviso.style.display = 'none';
    }, 100);
}

function detectarPalavrao(texto) {
    const palavrasProibidas = [
        "cv", "CV", "aaaaaaaa",
        "desgraça", "merda", "porra", "caralho",
        "fdp", "foda-se", "filho da puta", "cu", "bosta",
        "aaaaaaaaaaaaa", "aaaaaaaaaaaaaa", "aaaaaaaaaaaaaaa", "//////////", "spam"
    ]; // palavras que vai ser bloqueado 

    const textoLimpo = texto.toLowerCase();
    for (const proibida of palavrasProibidas) {
        if (textoLimpo.includes(proibida)) {
            return proibida;
        }
    }
    return null;
}

function enviarMensagem() {
    const agora = Date.now();
    const tentativas = JSON.parse(localStorage.getItem('tentativas') || "[]");
    const recentes = tentativas.filter(t => agora - t < BLOQUEIO_10);

    if (recentes.length >= LIMITE) {
        const espera = Math.ceil((BLOQUEIO_10 - (agora - recentes[recentes.length - 1])) / 60000);
        mostrarPopup(`⏳ Aguarde ${espera} minuto(s) para tentar novamente.`, "error");
        return;
    }

    const msg = document.getElementById('mensagem').value.trim();
    if (!msg) {
        mostrarPopup("⚠️ Escreva uma mensagem!", "error"); // deixou o input vazio
        return;
    }

    const palavraErrada = detectarPalavrao(msg);
    if (palavraErrada) {
        mostrarPopup(`🚫 Corrija: "${palavraErrada}" não é permitido.`, "error"); // qual palavra a ser corrigir
        return;
    }

    const mensagem = document.getElementById('mensagem').value.trim();

    fetch("enviar.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `mensagem=${encodeURIComponent(mensagem)}`
    })
        .then(response => response.text())
        .then(resultado => {
            if (resultado === "ok") {
                mostrarPopup("✅ Mensagem enviada, Aguarde!.", "success"); // foi mandado pro telegram
                document.getElementById('mensagem').value = '';
                recentes.push(agora);
                localStorage.setItem('tentativas', JSON.stringify(recentes));
            } else {
                mostrarPopup("❌ Erro ao enviar!", "error"); // erro ao enviar pro telegram 
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            mostrarPopup("❌ Erro ao enviar!", "error"); // erro ao enviar pro telegram
        });

    document.getElementById('mensagem').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            enviarMensagem();
        }
    });
}

function preencherMensagem(texto) {
    document.getElementById("mensagem").value = texto;
}

const input = document.getElementById("mensagem");
const avisoCaracteres = document.getElementById("avisoCaracteres");

input.addEventListener("input", () => {
    if (input.value.length >= 40) {
        input.value = input.value.slice(0, 40);
    }

    avisoCaracteres.style.display = input.value.length >= 35 ? "block" : "none";
});