import { NextRequest, NextResponse } from "next/server"

import OpenAi from "openai"
export async function POST(request: NextRequest) {
  const data = await request.json()
  const openai = new OpenAi({
    apiKey: process.env.CHAT_GPT_KEY,
  })

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What’s in this image?" },
            {
              type: "image_url",
              image_url: {
                url: data.image,
              },
            },
            {
              type: "text",
              text: "Answer in Thai",
            },
          ],
        },
      ],
      max_tokens: 2048,
    })
    const objectInfo = response.choices[0]

    return NextResponse.json({
      message: objectInfo,
    })
  } catch (error) {
    console.log(error)
  }
}
