// Importaciones necesarias para el componente
import { Message } from "@/types/chat";
import Image from "next/image";
import { clsx } from "clsx";
import Markdown from "react-markdown";
import { useRef, useEffect } from "react";

// Definición de tipos para las props del componente
interface MessageListProps {
  messages: Message[];
  streamingMessage?: string;
}

export const MessageList = ({ messages, streamingMessage }: MessageListProps) => {
  // Referencia para el scroll automático
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Función para desplazar la vista al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Efecto para hacer scroll cuando hay nuevos mensajes o streaming
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  return (
    // Contenedor principal de la lista de mensajes
    <div className="flex flex-col space-y-6 py-4">
      {/* Mapeo de los mensajes existentes */}
      {messages.map((message, index) => (
        <div
          key={index}
          className={clsx("flex", {
            // Alineación de mensajes según el rol
            "justify-end": message.role === "user",
            "justify-start": message.role === "assistant",
          })}
        >
          <div
            className={clsx("max-w-[85%] rounded-2xl px-4 py-3", {
              // Estilos condicionales según el rol del mensaje
              "bg-[#09995b] text-white": message.role === "user",
              "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100":
                message.role === "assistant",
            })}
          >
            {/* Renderizado del contenido markdown del mensaje */}
            <Markdown
              components={{
                // Configuración personalizada para imágenes en markdown
                img: ({ node, ...props }) => {
                  return <img {...props} className="rounded-xl my-2.5" />;
                },
              }}
            >
              {message.content}
            </Markdown>

            {/* Renderizado de imágenes adjuntas al mensaje */}
            {message.image_data && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {/* Manejo de múltiples imágenes o imagen única */}
                {Array.isArray(message.image_data) ? (
                  message.image_data.map((imgData, imgIndex) => (
                    <Image
                      key={imgIndex}
                      src={`data:image/jpeg;base64,${imgData}`}
                      alt={`Uploaded image ${imgIndex + 1}`}
                      width={300}
                      height={300}
                      className="rounded-xl"
                    />
                  ))
                ) : (
                  <Image
                    src={`data:image/jpeg;base64,${message.image_data}`}
                    alt="Uploaded image"
                    width={300}
                    height={300}
                    className="rounded-xl"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Renderizado del mensaje en streaming */}
      {streamingMessage && (
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <Markdown>{streamingMessage}</Markdown>
          </div>
        </div>
      )}
      
      {/* Elemento de referencia para el scroll automático */}
      <div ref={messagesEndRef} />
    </div>
  );
};
