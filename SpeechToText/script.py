"""
Clase de Transcripción de Audio con OpenAI API

OpenAI proporciona un modelo de transcripción de audio llamado Whisper. Este modelo es capaz de transcribir audio en varios idiomas, incluyendo español.

En este ejemplo, hemos creado un archivo de audio y lo hemos subido al modelo de transcripción de audio de OpenAI. Luego, hemos obtenido la transcripción del audio y la hemos mostrado en la terminal.
"""

import os
from dotenv import load_dotenv
from openai import OpenAI
import requests
import json

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

audio_file = open("speech.mp3", "rb")

transcript = client.audio.transcriptions.create(
    model="whisper-1",
    file=audio_file
)

print("Transcripción")
print(transcript.text)

