from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters
import logging
import json
import os
from dotenv import load_dotenv
from telegram.ext import ContextTypes
import asyncio
import nest_asyncio

load_dotenv()

ARQUIVO_STATUS = "./paginas/status.json"
TOKEN = os.getenv("TOKEN")
CHAT_ID = os.getenv("CHAT_ID")

def carregar_status():
    if not os.path.exists(ARQUIVO_STATUS):
        return {"casas_disponiveis": []}
    with open(ARQUIVO_STATUS, "r") as f:
        return json.load(f)

def salvar_status(status):
    with open(ARQUIVO_STATUS, "w") as f:
        json.dump(status, f, indent=4)
    print(f"Status salvo: {json.dumps(status, indent=4)}")

# comando /desalugada
async def desalugada(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Uso correto: /desalugada <número>")
        return

    try:
        id_casa = int(context.args[0])
    except ValueError:
        await update.message.reply_text("Por favor, insira um número válido de casa.")
        return

    status = carregar_status()

    if id_casa not in status["casas_disponiveis"]:
        status["casas_disponiveis"].append(id_casa)
        salvar_status(status)
        await update.message.reply_text(f"Casa {id_casa} agora está DISPONÍVEL ✅") # mensagem feito
    else:
        await update.message.reply_text(f"Casa {id_casa} já estava disponível.") # mensagem feito ser repetir o mesmo comando

# comando /alugada
async def alugada(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Uso correto: /alugada <número>")
        return

    try:
        id_casa = int(context.args[0])
    except ValueError:
        await update.message.reply_text("Por favor, insira um número válido de casa.")
        return

    status = carregar_status()

    if id_casa in status["casas_disponiveis"]:
        status["casas_disponiveis"].remove(id_casa)
        salvar_status(status)
        await update.message.reply_text(f"Casa {id_casa} agora está INDISPONÍVEL ❌") # mensagem feito 
    else:
        await update.message.reply_text(f"Casa {id_casa} já estava indisponível.") # menssagem feito repetição

chat_id = os.getenv("CHAT_ID") 

# Enviar mensagem para o grupo
async def enviar_para_grupo(context):
    mensagem = "📢 Bot Funcionando!"
    await context.bot.send_message(chat_id=chat_id, text=mensagem)

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)
logger = logging.getLogger(__name__)

# Run bot
async def main():
    application = Application.builder().token(TOKEN).build()

    application.add_handler(CommandHandler("desalugada", desalugada))
    application.add_handler(CommandHandler("alugada", alugada))

    # Envia mensagem para o grupo após 5 segundos
    application.job_queue.run_once(enviar_para_grupo, 5)

    await application.run_polling()

if __name__ == '__main__':
    nest_asyncio.apply()
    asyncio.run(main())
