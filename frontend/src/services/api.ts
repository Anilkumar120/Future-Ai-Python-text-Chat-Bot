const API_URL =
  "http://127.0.0.1:5000/api";


/* =========================================================
   CHAT HISTORY
========================================================= */

export interface ChatHistoryItem {

  role:
    | "user"
    | "assistant";

  content: string;
}


/* =========================================================
   CHAT RESPONSE
========================================================= */

export interface ChatResponse {

  success: boolean;

  type:
    | "text"
    | "image"
    | "video";

  message: string;

  image_url?: string;

  video_url?: string;

  model?: string;

  prompt?: string;
}


/* =========================================================
   SEND CHAT
========================================================= */

export async function sendChat(

  message: string,

  history: ChatHistoryItem[] = []

): Promise<ChatResponse> {


  const response =
    await fetch(

      `${API_URL}/chat`,

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

        },

        body: JSON.stringify({

          message,

          history,

        }),

      }

    );


  let data: ChatResponse;


  try {

    data =
      await response.json();

  } catch {

    throw new Error(
      "Backend returned an invalid response."
    );

  }


  if (!response.ok) {

    throw new Error(

      data.message ||
      "Failed to connect to backend."

    );

  }


  return data;
}


/* =========================================================
   DIRECT IMAGE API
========================================================= */

export interface ImageGenerateResponse {

  success: boolean;

  message: string;

  image_url: string;

  model: string;

  prompt: string;
}


export async function generateImage(

  prompt: string,

  model: string = "flux"

): Promise<ImageGenerateResponse> {


  const response =
    await fetch(

      `${API_URL}/image`,

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

        },

        body: JSON.stringify({

          prompt,

          model,

        }),

      }

    );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(

      data.detail ||
      "Image generation failed."

    );

  }


  return data;
}