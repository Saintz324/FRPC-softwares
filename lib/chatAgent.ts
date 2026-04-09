export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function sendMessage(messages: Message[]): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.statusText}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error)
  }

  return data.content as string
}
