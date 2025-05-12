<?php
// Inclui o autoloader do Composer (não se esqueça de executar o composer install primeiro!)
require_once __DIR__ . '/vendor/autoload.php'; 

// Carrega o arquivo .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Pega o token do bot do Telegram do arquivo .env
$token = $_ENV['TOKEN'];
$chat_id = $_ENV['CHAT_ID']; 

// Recebe a mensagem do formulário
$mensagem = isset($_POST['mensagem']) ? $_POST['mensagem'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['mensagem'])) {
    $mensagem = $_POST['mensagem'];
   
    $url = "https://api.telegram.org/bot$token/sendMessage?chat_id=$chat_id&text=" . urlencode($mensagem);

    // Envia a mensagem para o Telegram
    $response = file_get_contents($url);

    if ($response) {
        echo "Mensagem enviada com sucesso!";
    } else {
        echo "Erro ao enviar a mensagem!";
    }
} else {
    echo "Por favor, envie uma mensagem.";
}
?>
