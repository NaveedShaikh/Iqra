import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        console.log(process.env.OPENAI_API_KEY,'aaaaa')
        const body = await request.json();
        const { difficulty, topic, keywords } = body;

        const completion = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "developer",
                        content: "You are an expert quiz generator that creates questions based on the difficulty (easy, medium, hard) and the topic of the questions. Create exactly 3 multiple choice questions and 2 short answer questions. IMPORTANT: Every question MUST have both a type (mcq/short_answer) and a difficulty level (easy/medium/hard) specified."
                    },
                    {
                        role: "user",
                        content: `Generate questions about ${topic} at ${difficulty} difficulty level. Following keywords will give you the context of the questions: ${keywords.join(', ')}. Create exactly 3 MCQs and 2 short answer questions. Make sure each question has both type and difficulty specified.`
                    }
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "quiz_questions_schema",
                        schema: {
                            "type": "object",
                            "properties": {
                                "questions": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "question": { "type": "string" },
                                            "type": { "type": "string", "enum": ["mcq", "short_answer"] },
                                            "difficulty": { "type": "string", "enum": ["easy", "medium", "hard"] },
                                            "options": {
                                                "type": "array",
                                                "items": { "type": "string" }
                                            }
                                        },
                                        "required": ["question", "type", "difficulty", "options"],
                                        "additionalProperties": false
                                    },
                                },
                            },
                            "required": ["questions"],
                            "additionalProperties": false
                        },

                        "strict": true
                    }
                }
            })
        });

        const result = await completion.json();

        try {
            if (result.error) {
                console.error('OpenAI API Error:', result.error);
                return NextResponse.json(
                    { error: result.error.message || 'OpenAI API Error' },
                    { status: 500 }
                );
            }

            if (!result.choices) {
                console.error('Unexpected API response structure:', result);
                return NextResponse.json(
                    { error: 'Invalid API response structure' },
                    { status: 500 }
                );
            }

            const parsedContent = JSON.parse(result.choices[0].message.content);
            console.log(parsedContent);
            return NextResponse.json({
                questions: parsedContent.questions
            });

        } catch (parseError) {
            console.error('Error parsing OpenAI response:', parseError);
            return NextResponse.json(
                { error: 'Failed to parse questions response' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Quiz generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate quiz questions' },
            { status: 500 }
        );
    }
}
