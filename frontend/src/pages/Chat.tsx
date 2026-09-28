import { useState } from "react";

import {
  sendChat,
  type ChatHistoryItem,
} from "../services/api";

import "./Chat.css";


/* =========================================================
   MESSAGE TYPE
========================================================= */

interface Message {

  id: number;

  role:
    | "user"
    | "assistant";

  type:
    | "text"
    | "image"
    | "video";

  content: string;

  imageUrl?: string;

  videoUrl?: string;
}


/* =========================================================
   MEDIA URL
========================================================= */

function getMediaUrl(
  path?: string
): string {

  if (!path) {
    return "";
  }


  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {

    return path;
  }


  return (
    `http://127.0.0.1:5000${path}`
  );
}


/* =========================================================
   CHAT PAGE
========================================================= */

export default function Chat() {


  /* =======================================================
     CHAT INPUT
  ======================================================= */

  const [input, setInput] =
    useState("");


  /* =======================================================
     CREATION PROMPT
  ======================================================= */

  const [creationPrompt, setCreationPrompt] =
    useState("");


  /* =======================================================
     CREATION TYPE
  ======================================================= */

  const [creationType, setCreationType] =
    useState<
      "image" | "video"
    >("image");


  /* =======================================================
     LOADING
  ======================================================= */

  const [loading, setLoading] =
    useState(false);


  const [creationLoading, setCreationLoading] =
    useState(false);


  /* =======================================================
     MESSAGES
  ======================================================= */

  const [messages, setMessages] =
    useState<Message[]>([
      {
        id: 1,

        role:
          "assistant",

        type:
          "text",

        content:
          "Hello! I am Future AI. How can I help you?",
      },
    ]);


  /* =======================================================
     SEND CHAT
  ======================================================= */

  async function handleSend() {

    const message =
      input.trim();


    if (
      !message ||
      loading
    ) {

      return;
    }


    /* =====================================================
       USER MESSAGE
    ===================================================== */

    const userMessage: Message = {

      id:
        Date.now(),

      role:
        "user",

      type:
        "text",

      content:
        message,
    };


    setMessages(
      previous => [
        ...previous,
        userMessage,
      ]
    );


    setInput("");

    setLoading(true);


    try {

      /* ===================================================
         HISTORY
      =================================================== */

      const history:
        ChatHistoryItem[] =

        messages
          .filter(
            item =>
              item.type === "text"
          )
          .map(
            item => ({
              role:
                item.role,

              content:
                item.content,
            })
          );


      /* ===================================================
         API REQUEST
      =================================================== */

      const data =
        await sendChat(
          message,
          history
        );


      /* ===================================================
         IMAGE RESPONSE
      =================================================== */

      const imagePath =
        data.image_url;


      if (
        data.success &&
        data.type === "image" &&
        imagePath
      ) {

        const assistantMessage:
          Message = {

          id:
            Date.now() + 1,

          role:
            "assistant",

          type:
            "image",

          content:
            data.message ||
            "Image generated successfully.",

          imageUrl:
            getMediaUrl(
              imagePath
            ),
        };


        setMessages(
          previous => [
            ...previous,
            assistantMessage,
          ]
        );


        return;
      }


      /* ===================================================
         VIDEO RESPONSE
      =================================================== */

      const videoPath =
        data.video_url;


      if (
        data.success &&
        data.type === "video" &&
        videoPath
      ) {

        const assistantMessage:
          Message = {

          id:
            Date.now() + 1,

          role:
            "assistant",

          type:
            "video",

          content:
            data.message ||
            "Video generated successfully.",

          videoUrl:
            getMediaUrl(
              videoPath
            ),
        };


        setMessages(
          previous => [
            ...previous,
            assistantMessage,
          ]
        );


        return;
      }


      /* ===================================================
         TEXT RESPONSE
      =================================================== */

      const assistantMessage:
        Message = {

        id:
          Date.now() + 1,

        role:
          "assistant",

        type:
          "text",

        content:
          data.message ||
          "No response received.",
      };


      setMessages(
        previous => [
          ...previous,
          assistantMessage,
        ]
      );


    } catch (error) {

      console.error(
        "Chat Error:",
        error
      );


      setMessages(
        previous => [

          ...previous,

          {

            id:
              Date.now() + 1,

            role:
              "assistant",

            type:
              "text",

            content:

              error instanceof Error

                ? error.message

                : "Unable to connect to Future AI.",
          },

        ]
      );


    } finally {

      setLoading(false);

    }
  }


  /* =======================================================
     ENTER KEY
  ======================================================= */

  function handleKeyDown(
    event:
      React.KeyboardEvent<
        HTMLInputElement
      >
  ) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSend();

    }
  }


  /* =======================================================
     CREATE IMAGE / VIDEO
  ======================================================= */

  async function handleCreate() {

    const prompt =
      creationPrompt.trim();


    if (
      !prompt ||
      creationLoading
    ) {

      return;
    }


    setCreationLoading(true);


    try {

      /* ===================================================
         FORCE SELECTED TYPE
      =================================================== */

      const requestPrompt =

        creationType === "image"

          ? `create an image of ${prompt}`

          : `create a video of ${prompt}`;


      const data =
        await sendChat(
          requestPrompt,
          []
        );


      /* ===================================================
         IMAGE
      =================================================== */

      const imagePath =
        data.image_url;


      if (
        data.success &&
        data.type === "image" &&
        imagePath
      ) {

        const userId =
          Date.now();


        const assistantId =
          userId + 1;


        setMessages(
          previous => [

            ...previous,

            {

              id:
                userId,

              role:
                "user",

              type:
                "text",

              content:
                `Create image: ${prompt}`,

            },

            {

              id:
                assistantId,

              role:
                "assistant",

              type:
                "image",

              content:
                data.message ||
                "Image generated successfully.",

              imageUrl:
                getMediaUrl(
                  imagePath
                ),

            },

          ]
        );


        setCreationPrompt("");

        return;
      }


      /* ===================================================
         VIDEO
      =================================================== */

      const videoPath =
        data.video_url;


      if (
        data.success &&
        data.type === "video" &&
        videoPath
      ) {

        const userId =
          Date.now();


        const assistantId =
          userId + 1;


        setMessages(
          previous => [

            ...previous,

            {

              id:
                userId,

              role:
                "user",

              type:
                "text",

              content:
                `Create video: ${prompt}`,

            },

            {

              id:
                assistantId,

              role:
                "assistant",

              type:
                "video",

              content:
                data.message ||
                "Video generated successfully.",

              videoUrl:
                getMediaUrl(
                  videoPath
                ),

            },

          ]
        );


        setCreationPrompt("");

        return;
      }


      /* ===================================================
         BACKEND ERROR
      =================================================== */

      setMessages(
        previous => [

          ...previous,

          {

            id:
              Date.now(),

            role:
              "assistant",

            type:
              "text",

            content:
              data.message ||
              "Creation failed.",

          },

        ]
      );


    } catch (error) {

      console.error(
        "Creation Error:",
        error
      );


      setMessages(
        previous => [

          ...previous,

          {

            id:
              Date.now(),

            role:
              "assistant",

            type:
              "text",

            content:

              error instanceof Error

                ? error.message

                : "Creation failed.",

          },

        ]
      );


    } finally {

      setCreationLoading(false);

    }
  }


  /* =======================================================
     UI
  ======================================================= */

  return (

    <div className="future-ai-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="future-ai-header">

        <div>

          <h1>
            Future AI
          </h1>

          <p>
            Chat, create images and generate videos
          </p>

        </div>

      </header>


      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="future-ai-content">


        {/* =================================================
            LEFT - CHAT
        ================================================= */}

        <section className="chat-panel">


          <div className="panel-header">

            <div>

              <h2>
                AI Chat
              </h2>

              <span>
                Ask anything
              </span>

            </div>

          </div>


          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className="chat-messages">


            {messages.map(
              message => (

                <div
                  key={
                    message.id
                  }

                  className={
                    `message ${message.role}`
                  }
                >


                  {/* =========================================
                      NAME
                  ========================================= */}

                  <strong>

                    {
                      message.role ===
                      "assistant"

                        ? "Future AI"

                        : "You"
                    }

                  </strong>


                  {/* =========================================
                      TEXT
                  ========================================= */}

                  {message.type === "text" && (

                    <p>
                      {message.content}
                    </p>

                  )}


                  {/* =========================================
                      IMAGE
                  ========================================= */}

                  {message.type === "image" && (

                    <div>

                      <p>
                        {message.content}
                      </p>


                      {message.imageUrl && (

                        <>

                          <img

                            src={
                              message.imageUrl
                            }

                            alt="Generated"

                            className=
                              "generated-image"

                          />


                          <a

                            href={
                              message.imageUrl
                            }

                            target="_blank"

                            rel="noreferrer"

                            className=
                              "media-link"

                          >

                            Open Image

                          </a>

                        </>

                      )}

                    </div>

                  )}


                  {/* =========================================
                      VIDEO
                  ========================================= */}

                  {message.type === "video" && (

                    <div>

                      <p>
                        {message.content}
                      </p>


                      {message.videoUrl && (

                        <>

                          <video

                            controls

                            preload="metadata"

                            className=
                              "generated-video"

                          >

                            <source

                              src={
                                message.videoUrl
                              }

                              type="video/mp4"

                            />

                            Your browser does not
                            support video playback.

                          </video>


                          <a

                            href={
                              message.videoUrl
                            }

                            target="_blank"

                            rel="noreferrer"

                            className=
                              "media-link"

                          >

                            Open Video

                          </a>

                        </>

                      )}

                    </div>

                  )}

                </div>

              )
            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

              <div className="message assistant">

                <strong>
                  Future AI
                </strong>

                <p>
                  Thinking...
                </p>

              </div>

            )}

          </div>


          {/* =================================================
              CHAT INPUT
          ================================================= */}

          <div className="chat-input-area">


            <input

              type="text"

              value={
                input
              }

              onChange={
                event =>
                  setInput(
                    event.target.value
                  )
              }

              onKeyDown={
                handleKeyDown
              }

              placeholder=
                "Ask anything..."

              disabled={
                loading
              }

              autoComplete="off"

            />


            <button

              type="button"

              onClick={
                handleSend
              }

              disabled={
                loading ||
                !input.trim()
              }

            >

              {
                loading
                  ? "..."
                  : "Send"
              }

            </button>

          </div>

        </section>


        {/* =================================================
            RIGHT - CREATION STUDIO
        ================================================= */}

        <section className="creation-panel">


          <div className="panel-header">

            <div>

              <h2>
                Creation Studio
              </h2>

              <span>
                Create visual content
              </span>

            </div>

          </div>


          {/* =================================================
              IMAGE / VIDEO TABS
          ================================================= */}

          <div className="creation-tabs">


            <button

              type="button"

              className={

                creationType === "image"

                  ? "active"

                  : ""

              }

              onClick={() =>
                setCreationType(
                  "image"
                )
              }

            >

              Image

            </button>


            <button

              type="button"

              className={

                creationType === "video"

                  ? "active"

                  : ""

              }

              onClick={() =>
                setCreationType(
                  "video"
                )
              }

            >

              Video

            </button>

          </div>


          {/* =================================================
              CREATION FORM
          ================================================= */}

          <div className="creation-form">


            <label>
              Describe what you want
            </label>


            <textarea

              value={
                creationPrompt
              }

              onChange={
                event =>
                  setCreationPrompt(
                    event.target.value
                  )
              }

              placeholder={

                creationType === "image"

                  ? "A realistic Bengal tiger in a jungle..."

                  : "A tiger running through a jungle..."

              }

              rows={7}

              disabled={
                creationLoading
              }

            />


            <button

              type="button"

              className=
                "create-button"

              onClick={
                handleCreate
              }

              disabled={

                creationLoading ||

                !creationPrompt.trim()

              }

            >

              {

                creationLoading

                  ? "Creating..."

                  : creationType === "image"

                    ? "Create Image"

                    : "Create Video"

              }

            </button>

          </div>


          {/* =================================================
              QUICK PROMPTS
          ================================================= */}

          <div className="quick-prompts">


            <h3>
              Quick Prompts
            </h3>


            <button

              type="button"

              onClick={() =>

                setCreationPrompt(

                  "a realistic Bengal tiger standing in a dense green jungle"

                )

              }

            >

              Tiger in Jungle

            </button>


            <button

              type="button"

              onClick={() =>

                setCreationPrompt(

                  "a futuristic city at night with flying cars and neon lights"

                )

              }

            >

              Futuristic City

            </button>


            <button

              type="button"

              onClick={() =>

                setCreationPrompt(

                  "a beautiful mountain landscape during sunset"

                )

              }

            >

              Mountain Sunset

            </button>

          </div>

        </section>

      </div>

    </div>

  );
}
