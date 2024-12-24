// Importación de hooks de React y componentes de iconos
import { useState, useRef } from "react";
import { ImageIcon, Loader2, SendHorizonal } from "lucide-react";

// Definición de tipos para las props del componente
interface ChatInputProps {
  onSendMessage: (content: string, imageData?: string) => Promise<void>;
  onAddImage: (imageData: string) => void;
  pendingImages: string[];
  isLoading: boolean;
}

export const ChatInput = ({
  onSendMessage,
  onAddImage,
  pendingImages,
  isLoading,
}: ChatInputProps) => {
  // Estado local para el mensaje de texto
  const [message, setMessage] = useState("");
  // Referencia al input de archivo oculto
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejador del envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  // Manejador para la carga de archivos de imagen
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convertir la imagen a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1];
        onAddImage(base64String);
        setMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {/* Sección de previsualización de imágenes pendientes */}
      {pendingImages.length > 0 && (
        <div className="flex gap-2 px-4 pt-4 overflow-x-auto">
          {pendingImages.map((imageData, index) => (
            <div key={index} className="relative min-w-[100px] h-[100px]">
              <img
                src={`data:image/jpeg;base64,${imageData}`}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
      {/* Formulario principal de chat */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-x-2 p-4 bg-white dark:bg-transparent"
      >
        {/* Input oculto para la carga de archivos */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {/* Botón para seleccionar imagen */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ImageIcon className="h-6.5 w-6.5 text-gray-500 dark:text-gray-400" />
        </button>
        {/* Campo de entrada de texto */}
        <div className="flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje"
            className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 p-2 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              focus:outline-none focus:border-[#0ad17b] dark:focus:border-[#0ad17b] focus:ring-2 transition focus:ring-[#0ce989] dark:focus:ring-[#07b56a]
              placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        {/* Botón de envío con estado de carga */}
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="p-2.5 bg-[#07b56a] text-white rounded-lg 
            hover:bg-[#09995b] dark:hover:bg-[#09995b]
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-6.5 w-6.5 animate-spin" />
          ) : (
            <SendHorizonal className="h-6.5 w-6.5" />
          )}
        </button>
      </form>
    </div>
  );
};
