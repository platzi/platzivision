export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  image_data?: string[];
}

export interface ChatResponse {
  content?: string;
  status: 'streaming' | 'done' | 'error' | 'generating_image';
  imageUrl?: string;
  error?: string;
}

export interface ImageGenerationResponse {
  image_url: string;
  status: 'success' | 'error';
  error?: string;
}
