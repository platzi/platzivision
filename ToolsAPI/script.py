"""
Clase de herramientas en ChatCompletion API

Podemos utilizar herramientas en ChatCompletion API para que el modelo pueda interactuar con funciones externas.

Para este ejemplo hemos usado OpenMeteo, una API que nos permite obtener información del clima en tiempo real. En este caso, hemos creado una función que se encarga de obtener el clima de una ubicación específica basada en la latitud y longitud.

Luego, hemos creado un historial de mensajes que incluye un mensaje del sistema que le dice al modelo que use la función get_weather para obtener el clima de una ubicación específica. Así como un mensaje del usuario preguntando por el clima de Buenos Aires.

Finalmente, hemos ejecutado el modelo con las herramientas y el historial de mensajes. De esa forma el modelo llamará a la función, nosotros nos encargamos de ejecutarla en nuestro entorno, devolvemos la respuesta y el modelo la incluirá en su respuesta final.
"""

import os
from dotenv import load_dotenv
from openai import OpenAI
import requests
import json

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_weather(latitude: float, longitude: float) -> str:
    print("Getting weather...")
    url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true"
    response = requests.get(url)
    weather_data = response.json()

    return json.dumps(weather_data)

messages = [
    {
        "role": "system",
        "content": "Eres un asistente que entrega datos sobre el clima del mundo en tiempo real usando la función get_weather"
    },
    {
        "role": "user",
        "content": "¿Cuál es el clima de Buenos Aires?"
    }
]

functions = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Usa esta funcion para obtener información sobre el clima",
            "parameters": {
                "type": "object",
                "properties": {
                    "latitude": {
                        "type": "number",
                        "description": "Latitud de la ubicación"
                    },
                    "longitude": {
                        "type": "number",
                        "description": "Longitud de la ubicación"
                    }
                },
                "required": ["latitude", "longitude"]
            },
            "output": {
                "type": "string",
                "description": "Clima de la ubicación pedida por el usuario"
            }
        }
    }
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=functions
)

assistant_message = response.choices[0].message

print("Respuesta del asistente")
print(assistant_message)

if assistant_message.tool_calls:
    for tool_call in assistant_message.tool_calls:
        if tool_call.type == "function":
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)

            if function_name == "get_weather":
                print(f"El asistente está llamando a la función get_weather")
                weather_info = get_weather(
                    latitude=function_args.get("latitude"),
                    longitude=function_args.get("longitude")
                )

                messages.append(assistant_message)
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": function_name,
                    "content": weather_info
                })

second_response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages
)

final_reply = second_response.choices[0].message.content

print("Respuesta final del asistent")
print(final_reply)

