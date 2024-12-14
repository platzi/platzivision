Existe una diferencia en el formato de los mensajes cuando se insertan imágenes en el historial de mensajes.

Este es el formato cuando se inserta un mensaje de texto:

```py
{
    "role": "user",
    "content": "Hola, ¿de qué trata esta imagen?"
}
```

Este es el formato cuando se inserta un mensaje de imagen con un mensaje de texto:

```py
{
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": "Hola, ¿de qué trata esta imagen?"
        },
        {
            "type": "image_url",
            "image_url": {
                "url": f"https://ejemplo.com/imagen.png"
            }
        }
    ]
}
```


