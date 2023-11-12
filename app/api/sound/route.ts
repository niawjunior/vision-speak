import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import OpenAi from "openai"
export async function POST(request: NextRequest, res: NextResponse) {
  const data = await request.json()

  const openai = new OpenAi({
    apiKey: process.env.CHAT_GPT_KEY,
  })

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: data.text,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())
    const filePath = path.join(
      process.cwd(),
      "public",
      "audio",
      "generatedAudio.mp3"
    )
    fs.writeFileSync(filePath, buffer)
    const audioUrl = `/audio/generatedAudio.mp3`

    return NextResponse.json({
      sound: audioUrl,
    })

    // Return the audio as a response
  } catch (error) {
    return NextResponse.json({
      error: "Something went wrong",
    })
  }
}
