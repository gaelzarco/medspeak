import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

export async function getTranscript(audioFile: File) {
    if (!config.apiKey) {
        throw new Error("OPENAI_API_KEY not set")
    }
    
    const transcription = await openai.createTranscription(
        audioFile,
        'whisper-1',
        'text',
        'Please transcribe the following audio and create a summarized version of the conversation. This is a conversation between a medical professional and a patient. Please separate the text between the doctor and patient with a marker indicating who said what. Pay close attentions to drugs, anatomy, mental-health, diseases, procedures, and other medical history the patient mentions.',
        0,
        'en'
    )

    if (transcription.status === 200) return transcription.data
}