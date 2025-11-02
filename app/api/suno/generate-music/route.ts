import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { personalityAnswers, warpletName } = body;

    if (!personalityAnswers) {
      return NextResponse.json(
        { error: 'Personality answers are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SUNO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Suno API key not configured' },
        { status: 500 }
      );
    }

    // Transform personality answers into Suno API inputs
    // Adjust based on actual Suno API format
    const prompt = buildMusicPrompt(personalityAnswers, warpletName);
    const tags = extractTags(personalityAnswers);

    // Note: This is a placeholder implementation
    // You'll need to check Suno's actual API documentation for the correct endpoint
    // and request format
    
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
      console.error('Suno API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate music with Suno' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Poll for completion if needed
    let audioUrl = data.audio_url;
    let status = data.status;

    // If status is "generating", poll until complete
    if (status === 'generating' && data.id) {
      audioUrl = await pollForCompletion(data.id, apiKey);
    }
    
    return NextResponse.json({
      success: true,
      audioUrl: audioUrl || data.audio_url,
      songId: data.id,
      title: data.title,
    });
  } catch (error) {
    console.error('Error generating music:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function buildMusicPrompt(answers: any, warpletName?: string): string {
  // Transform personality answers into a music prompt
  const genre = answers.genre || 'electronic';
  const mood = answers.mood || 'energetic';
  const personality = answers.personality || 'confident';
  const themes = answers.themes ? `, with themes of ${answers.themes}` : '';
  
  return `A ${genre} song with a ${mood} mood, capturing the ${personality} personality of ${warpletName || 'a Warplet'}${themes}`;
}

function extractTags(answers: any): string[] {
  const tags: string[] = [];
  
  if (answers.genre) tags.push(answers.genre);
  if (answers.mood) tags.push(answers.mood);
  if (answers.instrumental) tags.push('instrumental');
  
  return tags;
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

