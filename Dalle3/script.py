"""
Clase de DALL·E 3 API

DALL·E 3 es un modelo de generación de imágenes de OpenAI.

Para este ejemplo hemos creado un prompt que describe la imagen que queremos generar y la calidad de la imagen. Luego, hemos ejecutado el modelo con el prompt y la calidad, y recibimos la URL de la imagen generada.
"""

import os
from dotenv import load_dotenv
from openai import OpenAI
import requests
import json

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

prompt = "Un atardecer en la ciudad"
quality = "standard"

response = client.images.generate(
    model="dall-e-3",
    prompt=prompt,
    quality=quality,
    n=1
)

print(response.data[0].url)
