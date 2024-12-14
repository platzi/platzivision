"""
Clase para el uso de Assistants (Beta)

En esta clase hemos creado un asistente, y luego accedido a él para enviarle un mensaje a través de un hilo.

Después hemos ejecutado el asistente y hemos obtenido los pasos que ha realizado para responder a nuestro mensaje (incluyendo el uso de la herramienta Code Interpreter).

Finalmente, hemos obtenido la respuesta del asistente y hemos imprimido los pasos que ha realizado para responder a nuestro mensaje.
"""

import os
from dotenv import load_dotenv
from openai import OpenAI
import requests
import json
import time

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

assistant_id = "asst_2iElhX5AoXTLOkn061BqHKE9"
thread = client.beta.threads.create()
print(f"Hilo creado con ID: {thread.id}")

message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="¿Cuánto es 16284+991893-771939*12456? Puedes ejecutar código Python para esto"
)

print("Ejecutando el asistente")
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant_id
)

while True:
    run = client.beta.threads.runs.retrieve(
        thread_id=thread.id,
        run_id=run.id
    )

    if run.status == "completed":
        print("Se completó la respuesta")
        break
    time.sleep(1)

if run.status == "completed":
    run_steps = client.beta.threads.runs.steps.list(
        thread_id=thread.id,
        run_id=run.id
    )

    for step in run_steps:
        if step.step_details.type == "tool_calls":
            for tool_call in step.step_details.tool_calls:
                if tool_call.type == "code_interpreter":
                    print("Código Python")
                    print(tool_call.code_interpreter.input)
    
    messages = client.beta.threads.messages.list(
        thread_id=thread.id,
        order="desc",
        limit=1
    )
    for msg in messages:
        if msg.role == "assistant":
            for content_block in msg.content:
                print(content_block.text.value)
