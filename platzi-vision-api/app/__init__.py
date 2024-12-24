from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import openai
import os
from app.api.chat import chat

def create_app():
    # Carga las variables de entorno
    load_dotenv()
    
    # Inicializa la aplicación Flask
    app = Flask(__name__)
    
    # Permite todos los orígenes con la configuración predeterminada de CORS
    CORS(app)
        
    # Registra las rutas directamente
    app.add_url_rule('/api/chat', 'chat', chat, methods=['POST'])
    
    return app
