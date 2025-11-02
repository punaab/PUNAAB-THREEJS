/**
 * Suno API utilities for music generation
 */

export interface SunoMusicOptions {
  personalityAnswers: Record<string, any>;
  warpletName?: string;
}

function buildMusicPrompt(answers: Record<string, any>, warpletName?: string): string {
  const genre = answers.genre || 'electronic';
  const mood = answers.mood || 'energetic';
  const personality = answers.personality || 'confident';
  const themes = answers.themes || '';

  let prompt = `A ${genre} song with a ${mood} mood, capturing the ${personality} personality`;
  
  if (warpletName) {
    prompt += ` of ${warpletName}`;
  }
  
  if (themes) {
    prompt += `. Themes: ${themes}`;
  }

  return prompt;
}

function extractTags(answers: Record<string, any>): string[] {
  const tags: string[] = [];
  
  if (answers.genre) tags.push(answers.genre);
  if (answers.mood) tags.push(answers.mood);
  if (answers.personality) tags.push(answers.personality);
  
  return tags;
}

export async function generateMusicWithSuno(options: SunoMusicOptions) {
  const apiKey = process.env.SUNO_API_KEY;
  if (!apiKey) {
    throw new Error('Suno API key not configured');
  }

  const prompt = buildMusicPrompt(options.personalityAnswers, options.warpletName);
  const tags = extractTags(options.personalityAnswers);

  // Note: This is a placeholder implementation
  // Update with actual Suno API endpoint and request format
  const response = await fetch('https://api.suno.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      tags,
      make_instrumental: false,
      wait_audio: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Suno API error: ${errorText}`);
  }

  const data = await response.json();
  
  // Poll for completion if needed
  let audioUrl = data.audio_url;
  let status = data.status;

  if (status === 'generating' && data.id) {
    audioUrl = await pollForCompletion(data.id, apiKey);
  }

  return {
    audioUrl: audioUrl || data.audio_url,
    songId: data.id,
    title: data.title || `Music for ${options.warpletName || 'Warplet'}`,
  };
}

async function pollForCompletion(songId: string, apiKey: string, maxAttempts = 30): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    const response = await fetch(`https://api.suno.ai/v1/song/${songId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === 'complete' && data.audio_url) {
        return data.audio_url;
      }
    }
  }
  
  throw new Error('Music generation timed out');
}

