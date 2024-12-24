'use client';

/**
 * Chat Component
 * --------------
 * Este componente actúa como el contenedor principal para la interfaz de chat.
 * Gestiona la lógica central de la aplicación de chat, incluyendo:
 * 
 * - Manejo del estado de mensajes y su flujo de comunicación
 * - Integración con la API de chat para envío/recepción de mensajes
 * - Coordinación entre los subcomponentes MessageList y ChatInput
 * 
 * Estructura de Componentes:
 * - Chat (este componente)
 *   ├─ MessageList: Renderiza la lista de mensajes y el mensaje en streaming
 *   └─ ChatInput: Maneja la entrada de texto y carga de imágenes
 * 
 * Flujo de Datos:
 * 1. Usuario ingresa mensaje/imagen en ChatInput
 * 2. Chat procesa la entrada y actualiza el estado
 * 3. Se envía la solicitud a la API
 * 4. La respuesta se procesa y se muestra en MessageList
 * 
 * Estados Principales:
 * - messages: Historial completo de mensajes
 * - streamingMessage: Mensaje actual en transmisión
 * - pendingImages: Imágenes pendientes de envío
 * - isLoading: Estado de carga durante las operaciones
 */

import { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { chatApi } from '@/lib/api';
import { Message } from '@/types/chat';

export const Chat = () => {
  // Estado para almacenar los mensajes
  const [messages, setMessages] = useState<Message[]>([]);
  // Estado para indicar si se está cargando
  const [isLoading, setIsLoading] = useState(false);
  // Estado para almacenar imágenes pendientes de enviar
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  // Estado para almacenar el mensaje que se está transmitiendo
  const [streamingMessage, setStreamingMessage] = useState<string>('');

  // Función para agregar una imagen a la lista de imágenes pendientes
  const handleAddImage = (imageData: string) => {
    setPendingImages(prev => [...prev, imageData]);
  };

  // Función para enviar un mensaje
  const handleSendMessage = async (content: string) => {
    // Crear un nuevo mensaje con el contenido proporcionado
    const newMessage: Message = {
      role: 'user',
      content,
      ...(pendingImages.length > 0 && { image_data: pendingImages }),
    };

    try {
      setIsLoading(true); // Indicar que se está cargando
      setPendingImages([]); // Limpiar imágenes pendientes
      setMessages(prev => [...prev, newMessage]); // Agregar el nuevo mensaje a la lista
      setStreamingMessage(''); // Limpiar el mensaje en transmisión

      // Enviar el mensaje a través de la API
      await chatApi.sendMessage([...messages, newMessage], (chunk) => {
        if (chunk.status === 'streaming' && chunk.content) {
          setStreamingMessage(chunk.content);
        } else if (chunk.status === 'generating_image') {
          // Add a temporary message while the image is being generated
          setStreamingMessage('Generando imagen...');
        } else if (chunk.status === 'done' && chunk.content) {
          const assistantMessage: Message = {
            role: 'assistant',
            content: chunk.content,
          };
          setMessages(prev => [...prev, assistantMessage]);
          setStreamingMessage('');
        }
      });
    } catch (error) {
      console.error('Error sending message:', error); // Manejo de errores
    } finally {
      setIsLoading(false); // Indicar que ha terminado de cargar
      setPendingImages([]); // Limpiar imágenes pendientes
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-32 py-4">
        <div className="max-w-3xl mx-auto">
          <MessageList messages={messages} streamingMessage={streamingMessage} />
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            onAddImage={handleAddImage}
            pendingImages={pendingImages}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
