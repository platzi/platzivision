"""
Clase de ChatCompletion API

Esta es la principal forma de interactuar con los modelos de lenguaje de OpenAI.

Para crear una respuesta de ChatCompletion API, necesitamos pasarle un modelo y un historial de mensajes. Este historial de mensajes es una lista de mensajes, donde cada mensaje tiene un rol (system, user, assistant) y un contenido (content).

El role de system es el que se le da al modelo como instrucción de cómo debe responder.
El role de user es el que se le da al modelo para que entienda el mensaje del usuario.
El role de assistant es el que se completa con la respuesta del modelo.
"""

import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "system",
            "content": "Te llamas PlatziVision, presentante como tal"
        },
        {
            "role": "user",
            "content": "Hola, ¿cómo estás?"
        },
        {
            "role": "assistant",
            "content": "¡Hola! Soy PlatziVision, un asistente virtual listo para ayudarte. ¿En qué puedo asistirte hoy?"
        },
        {
            "role": "user",
            "content": "¿Qué es Platzi?"
        }
    ],
    max_tokens=100,
    temperature=0.2
)

print(response.choices[0].message.content)
