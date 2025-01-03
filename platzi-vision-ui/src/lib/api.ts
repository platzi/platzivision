// Importación de tipos necesarios para el chat y respuestas de imágenes
import { Message, ChatResponse, ImageGenerationResponse } from '@/types/chat';

/**
 * @fileoverview API Client para la comunicación con el backend de Platzi Vision
 * 
 * Este módulo proporciona la interfaz principal para la comunicación entre el frontend
 * y el servidor de PlatziVision. Maneja específicamente:
 * 
 * - Comunicación en tiempo real con el servidor mediante Server-Sent Events (SSE)
 * - Procesamiento de mensajes del chat con streaming de respuestas
 * - Manejo de estados para la generación de imágenes
 * 
 * Interactúa con los siguientes componentes:
 * - Components/Chat: Utiliza este cliente para enviar/recibir mensajes
 * - Types/chat.ts: Define las interfaces Message y ChatResponse utilizadas aquí
 * - PlatziVision API: Se comunica con los endpoints de chat y generación de imágenes
 * 
 * El flujo típico de datos es:
 * 1. El usuario envía un mensaje
 * 2. El mensaje se transmite al servidor vía POST
 * 3. El servidor responde con un stream de datos que puede incluir:
 *    - Texto generado progresivamente
 *    - Estados de generación de imágenes
 *    - Mensajes de finalización
 * 
 * @see {@link Message} para la estructura de los mensajes
 * @see {@link ChatResponse} para los tipos de respuesta posibles
 */

export const chatApi = {
  // Función principal para enviar mensajes al API
  // Acepta un array de mensajes y una función opcional para manejar chunks de respuesta
  sendMessage: async (messages: Message[], onChunk: (chunk: ChatResponse) => void): Promise<ChatResponse> => {
    // Si hay función de callback, configura streaming de datos
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    // Configuración para lectura de stream de datos
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedMessage = ''; // Almacena el mensaje completo

    if (!reader) throw new Error('Failed to get response reader');

    // Bucle principal para procesar el stream de datos
    while (true) {
      // Lee chunks de datos del stream
      const { done, value } = await reader.read();
      if (done) break;

      // Decodifica y procesa cada chunk
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      // Procesa cada línea del chunk
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6);
          try {
            const data = JSON.parse(jsonStr);
            console.log('Parsed SSE data:', data);
            
            // Maneja diferentes estados de la respuesta
            if (data.status === 'streaming' && data.content) {
              // Acumula el contenido del mensaje y notifica
              accumulatedMessage += data.content;
              onChunk({ content: accumulatedMessage, status: 'streaming' });
            } else if (data.status === 'generating_image') {
              // Notifica cuando comienza la generación de imagen
              onChunk({ content: 'Generando imagen...', status: 'generating_image' });
            } else if (data.status === 'done') {
              // Finaliza el streaming y retorna el mensaje completo
              onChunk({ content: accumulatedMessage, status: 'done' });
              return { content: accumulatedMessage, status: 'done' };
            }
          } catch (e) {
            console.error('Failed to parse SSE chunk:', e);
          }
        }
      }
    }

    // Retorna el mensaje acumulado si el stream termina
    return { content: accumulatedMessage, status: 'done' };
  },
};
