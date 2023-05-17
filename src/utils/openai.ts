const apiKey = process.env.OPENAI_API_KEY

export async function getTranscript(audioData: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: audioData,
          model: 'whisper-1'
        }),
      });

    //   if (response.ok) {
    //     throw new Error('Failed to transcribe audio');
    //   }

      const data = await response.json();
      console.log(data)

      return data.transcript;
}