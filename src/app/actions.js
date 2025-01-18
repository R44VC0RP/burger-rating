'use server'

import OpenAI from 'openai';
import sharp from 'sharp';

const openai = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
});

export async function rateBurger(formData) {
    try {
        const image = formData.get('image');
        const buffer = await image.arrayBuffer();
        
        // Resize image before converting to base64
        const resizedImageBuffer = await sharp(Buffer.from(buffer))
            .resize(800, 800, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 })
            .toBuffer();
            
        const base64Image = resizedImageBuffer.toString('base64');
        
        const completion = await openai.chat.completions.create({
            model: "grok-2-vision-1212",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                                detail: "low"
                            },
                        },
                        {
                            type: "text",
                            text: "Analyze this burger. Respond in EXACTLY this format with no additional text:\n[RATING_START]<number 0-100>[RATING_END]\n[COMMENTS_START]<your detailed analysis>[COMMENTS_END]",
                        },
                    ],
                },
            ],
        });

        const response = completion.choices[0].message.content;
        console.log(response);
        // Parse using reliable markers
        const rating = parseInt(
            response.match(/\[RATING_START\](.*?)\[RATING_END\]/)[1]
        );
        const comments = response.match(/\[COMMENTS_START\](.*?)\[COMMENTS_END\]/)[1];
        
        return { rating, comments };
    } catch (error) {
        console.error('Error rating burger:', error.message);
        throw error;
    }
}