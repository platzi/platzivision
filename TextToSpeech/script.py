"""
Clase de Texto a Voz con OpenAI API

OpenAI proporciona dos modelos de texto a voz: tts-1 y tts-1-hd. Siendo la versión hd la que está más optimizada para la calidad del audio. También ofrece distintos voces para cada modelo como "alloy", "fable", "nova" y "shimmer".

En este ejemplo hemos utilizado el modelo tts-1 y la voz "alloy" para generar un audio a partir del texto "Me despierto, y hay nuevos avances en tecnología". Finalmente, hemos guardado el audio en un archivo llamado "speech.mp3".
"""

import os
from dotenv import load_dotenv
from openai import OpenAI
import requests
import json

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

with client.audio.speech.with_streaming_response.create(
    model="tts-1",
    voice="alloy",
    input="Me despierto, y hay nuevos avances en tecnología"
) as response:
    response.stream_to_file("speech.mp3")
