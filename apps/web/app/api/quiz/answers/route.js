import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = typeof request.json === 'function'
            ? await request.json()
            : JSON.parse(request.body);

        const { submissionData } = body;

        console.log("submissionData inside answers api: ", submissionData);

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
                        content: "You are an expert quiz evaluator. For each question, evaluate if the user's answer is correct. For MCQs, check if the selected option is correct. For short answer questions, evaluate based on key concepts and meaning rather than exact wording."
                    },
                    {
                        role: "user",
                        content: `Evaluate these quiz answers based on the questions: ${JSON.stringify(submissionData)}. If the answer is empty or incorrect, mark it as incorrect. If the answer is correct, mark it as correct.`
                    }
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "evaluate_answers",
                        schema: {
                            type: "object",
                            properties: {
                                evaluations: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            question: {
                                                type: "string",
                                                description: "The original question text"
                                            },
                                            isCorrect: {
                                                type: "boolean",
                                                description: "Whether the answer is correct or not"
                                            },
                                            userAnswer: {
                                                type: "string",
                                                description: "The answer provided by the user"
                                            }
                                        },
                                        required: ["question", "isCorrect", "userAnswer"]
                                    }
                                }
                            },
                            required: ["evaluations"]
                        }
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
                evaluations: parsedContent.evaluations
            });

        } catch (parseError) {
            console.error('Error parsing OpenAI response:', parseError);
            return NextResponse.json(
                { error: 'Failed to parse answer evaluations' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Answer evaluation error:', error);
        return NextResponse.json(
            { error: 'Failed to evaluate answers' },
            { status: 500 }
        );
    }
}
