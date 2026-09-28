import { useState } from "react";

import { generateImage } from "../services/api";


interface ImageResponse {
  success: boolean;
  message: string;
  image_url: string;
  model: string;
  prompt: string;
}


export default function Image() {

  const [prompt, setPrompt] =
    useState("");

  const [model, setModel] =
    useState("flux");

  const [imageUrl, setImageUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleGenerate() {

    const cleanPrompt =
      prompt.trim();


    if (!cleanPrompt) {

      setError(
        "Please enter an image prompt."
      );

      return;
    }


    setLoading(true);

    setError("");

    setImageUrl("");


    try {

      const data: ImageResponse =
        await generateImage(
          cleanPrompt,
          model
        );


      if (!data.success) {

        setError(
          data.message ||
          "Image generation failed."
        );

        return;
      }


      setImageUrl(
        data.image_url
      );


    } catch (error) {

      console.error(
        "Image generation error:",
        error
      );


      setError(
        error instanceof Error
          ? error.message
          : "Image generation failed."
      );


    } finally {

      setLoading(false);

    }
  }


  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {

    if (
      event.key === "Enter" &&
      event.ctrlKey
    ) {

      handleGenerate();

    }
  }


  return (

    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "30px",
        background: "#f5f7fb",
        boxSizing: "border-box"
      }}
    >

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto"
        }}
      >

        <h1
          style={{
            marginBottom: "8px"
          }}
        >
          Image Generator
        </h1>


        <p
          style={{
            color: "#666",
            marginBottom: "25px"
          }}
        >
          Create an image from your text prompt.
        </p>


        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "14px",
            boxShadow:
              "0 5px 25px rgba(0,0,0,0.08)"
          }}
        >

          <label
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: "8px"
            }}
          >
            Prompt
          </label>


          <textarea
            value={prompt}
            onChange={(event) =>
              setPrompt(
                event.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder="Example: A futuristic city at night with flying cars, cinematic lighting..."
            rows={5}
            style={{
              width: "100%",
              padding: "14px",
              border:
                "1px solid #ccc",
              borderRadius: "10px",
              resize: "vertical",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />


          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "15px",
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >

            <div>

              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "8px"
                }}
              >
                Model
              </label>


              <select
                value={model}
                onChange={(event) =>
                  setModel(
                    event.target.value
                  )
                }
                style={{
                  minWidth: "180px",
                  padding: "12px",
                  border:
                    "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "15px"
                }}
              >

                <option value="flux">
                  Flux
                </option>

                <option value="zimage">
                  ZImage
                </option>

                <option value="nanobanana">
                  Nano Banana
                </option>

                <option value="gptimage">
                  GPT Image
                </option>

              </select>

            </div>


            <button
              type="button"
              onClick={
                handleGenerate
              }
              disabled={
                loading ||
                !prompt.trim()
              }
              style={{
                marginTop: "27px",
                padding:
                  "13px 25px",
                border: "none",
                borderRadius: "9px",
                background: "#111111",
                color: "#ffffff",
                fontSize: "15px",
                cursor:
                  loading ||
                  !prompt.trim()
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  loading ||
                  !prompt.trim()
                    ? 0.5
                    : 1
              }}
            >

              {loading
                ? "Generating..."
                : "Generate Image"}

            </button>

          </div>


          <p
            style={{
              fontSize: "13px",
              color: "#777",
              marginTop: "12px"
            }}
          >
            Tip: Press Ctrl + Enter to generate.
          </p>


          {error && (

            <div
              style={{
                marginTop: "20px",
                padding: "12px",
                borderRadius: "8px",
                background: "#ffecec",
                color: "#c62828"
              }}
            >
              {error}
            </div>

          )}


          {loading && (

            <div
              style={{
                marginTop: "30px",
                textAlign: "center",
                color: "#666"
              }}
            >
              Creating your image...
            </div>

          )}


          {imageUrl && !loading && (

            <div
              style={{
                marginTop: "30px"
              }}
            >

              <h2>
                Generated Image
              </h2>


              <div
                style={{
                  marginTop: "15px",
                  background: "#f0f0f0",
                  padding: "10px",
                  borderRadius: "12px"
                }}
              >

                <img
                  src={imageUrl}
                  alt={prompt}
                  style={{
                    display: "block",
                    width: "100%",
                    maxWidth: "900px",
                    margin: "0 auto",
                    borderRadius: "10px"
                  }}
                />

              </div>


              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "15px",
                  textDecoration: "none"
                }}
              >
                Open Image
              </a>

            </div>

          )}

        </div>

      </div>

    </div>

  );
}