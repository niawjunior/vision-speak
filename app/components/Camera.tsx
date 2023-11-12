"use client"
import Image from "next/image"
import React, { useRef, useState, useCallback } from "react"
import Webcam from "react-webcam"

const Camera = () => {
  const webcamRef = useRef<Webcam>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<{ content: string }>({
    content: "",
  })
  const [capturedImage, setCapturedImage] = useState("")
  const [cameraActive, setCameraActive] = useState(true)

  const textToSpeech = async (text: string) => {
    try {
      const response = await fetch("/api/sound", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
      }).then((res) => res.json())

      await response

      setIsProcessing(false)
    } catch (error) {
      console.error("Error sending image to the API:", error)
      setIsProcessing(false)
    }
  }

  const captureAndSend = useCallback(async () => {
    if (!isProcessing && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      setIsProcessing(true)
      setCameraActive(false)

      setCapturedImage(imageSrc!)
      try {
        const response = await fetch("/api/vision", {
          method: "POST",
          body: JSON.stringify({ image: imageSrc }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json())

        const result = await response
        setMessage(result.message.message)
        textToSpeech(result.message.message?.content)
      } catch (error) {
        console.error("Error sending image to the API:", error)
        setIsProcessing(false)
      }
    }
  }, [webcamRef, isProcessing])

  const videoConstraints = {
    facingMode: "environment",
  }

  const close = () => {
    window.location.reload()
  }

  return (
    <div>
      <div className="camera-container">
        {message?.content && !isProcessing && (
          <button
            onClick={close}
            className="absolute top-4 right-4 p-1 bg-rose-400 z-20"
          >
            ปิด
          </button>
        )}
        {message?.content && !isProcessing && (
          <div className="message">
            <div className="message-container z-10">{message?.content}</div>
            <audio ref={audioRef} src={"/audio/generatedAudio.mp3"} />
            <div className="w-full flex justify-end">
              <button
                onClick={() => audioRef.current!.play()}
                className="bg-green-500 p-1 rounded-full m-1"
              >
                <div className="sound-icon ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.0"
                    width="500"
                    height="500"
                    viewBox="0 0 75 75"
                  >
                    <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z" />
                    <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        )}

        {cameraActive ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            id="video-stream"
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        ) : (
          capturedImage && (
            <div className="relative">
              {isProcessing && (
                <div className="absolute loading bg-black text-white">
                  รอสักครู่
                </div>
              )}
              <Image
                className="image-captured"
                src={capturedImage}
                alt="Captured"
                height={500}
                width={500}
              />
            </div>
          )
        )}

        <div className="camera-footer">
          <button
            className="camera-icon disabled:bg-slate-400"
            onClick={captureAndSend}
            disabled={isProcessing}
          >
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="512px"
              height="512px"
              viewBox="0 0 512 512"
            >
              <g>
                <g>
                  <path
                    d="M256,48C141.1,48,48,141.1,48,256s93.1,208,208,208c114.9,0,208-93.1,208-208S370.9,48,256,48z M256,446.7
			c-105.1,0-190.7-85.5-190.7-190.7c0-105.1,85.5-190.7,190.7-190.7c105.1,0,190.7,85.5,190.7,190.7
			C446.7,361.1,361.1,446.7,256,446.7z"
                  />
                </g>
              </g>
              <g>
                <g>
                  <path d="M256,96c-88.4,0-160,71.6-160,160c0,88.4,71.6,160,160,160c88.4,0,160-71.6,160-160C416,167.6,344.4,96,256,96z" />
                </g>
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Camera
