"""
Clase de manejo de imágenes en GPT-4o

GPT-4o es capaz de procesar imágenes y analizarlas para responder a la pregunta del usuario.

Tenemos dos formas de procesar imágenes en GPT-4o: mediante la URL de la imagen o proporcionando la imagen en base64.

En este ejemplo hemos creado una función que se encarga de codificar una imagen en base64. Luego, hemos creado un historial de mensajes que incluye un mensaje del sistema que le dice al modelo si pudiera analizar la imagen, luego adjuntamos la imagen en base64 y finalmente el modelo nos responde con la descripción de la imagen.
"""

import os
from dotenv import load_dotenv
from openai import OpenAI
import base64

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

messages = [
    {
        "role": "system",
        "content": "Eres un asistente que analiza las imagenes a gran detalle."
    },
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": "Hola, ¿puedes analizar esta imagen?",
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/png;base64,{encode_image_to_base64('./image.png')}"
                }
            }
        ]
    }
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages
)

print("Respuesta del analisis de la imagen")
print(response.choices[0].message.content)
