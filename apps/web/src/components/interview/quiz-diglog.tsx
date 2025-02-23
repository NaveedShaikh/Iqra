"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useQuiz } from "@/src/hooks/useQuiz"
import { X } from "lucide-react"

export default function QuizDialog({ open, setOpen, handelClick, quizConfig }: { open: boolean; setOpen: (open: boolean) => void; handelClick: (status:string) => void; quizConfig: any }) {
    const {
        currentQuestion,
        answers,
        handleAnswer,
        submitQuiz,
        resetQuiz,
        nextQuestion,
        showResults,
        results,
        timeRemaining,
        progress,
        loading,
        currentQuestionIndex,
        questions,
        useranswers,
        handleAnswerChange,
        submitLoading,
        error
    } = useQuiz(quizConfig,handelClick)

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    }

    return (

        <div className={`fixed top-0 left-0 right-0  bottom-0 bg-black/20 ${!open && 'hidden'} z-[100000] overflow-auto`}>
            <div className="bg-white w-[45rem] p-5 mx-auto mt-32 rounded-md relative">
                <div className="absolute top-0 right-0 p-2">
                    <Button onClick={() => setOpen(false)} className="bg-black text-white"><X/></Button>
                </div>
                <>
                    {
                        !loading && !error &&
                        <>

                            {!showResults ? (
                                <>
                                   
                                    <div className="grid gap-4 py-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-3xl">
                                                Question {currentQuestionIndex} of {questions?.length}
                                            </span>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`question-${currentQuestion?.id}`} className="font-medium text-[18px] mb-4">
                                                {currentQuestion?.question}
                                            </Label>
                                            {currentQuestion?.type != "mcq" ? (
                                                <Textarea
                                                    id={`question-${currentQuestion?.id}`}
                                                    value={useranswers[currentQuestion?.id] || ''}
                                                    onChange={(e) => handleAnswerChange(currentQuestion?.id, e.target.value)}
                                                    placeholder="Enter your SQL query here"
                                                />
                                            ) : currentQuestion?.options ? (
                                                <div className="flex flex-col gap-4">
                                                    {currentQuestion?.options.map((option) => (
                                                        <div key={option} className="flex items-center space-x-2 text-[16px]">
                                                            <input
                                                                type="radio"
                                                                name={`question-${option.id}`}
                                                                value={option}
                                                                checked={useranswers[currentQuestion?.id] === option}
                                                                onChange={(e) => handleAnswerChange(currentQuestion?.id, e.target.value)}
                                                                className="form-radio h-4 w-4 text-blue-600"
                                                            />
                                                            <Label htmlFor={`${currentQuestion?.id}-${option}`}>{option}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Input
                                                    id={`question-${currentQuestion?.id}`}
                                                    value={answers[currentQuestion?.id] || ""}
                                                    onChange={(e) => handleAnswer(currentQuestion?.id, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-5 flex items-center justify-end">
                                        {
                                            !submitLoading ?
                                            <Button className="bg-themePrimary text-white" onClick={nextQuestion}>{currentQuestionIndex === questions?.length -1 ? "Submit" : "Next"}</Button>
                                            :
                                            <Button className="bg-themePrimary text-white disabled:opacity-40" disabled={true}>Submiting...</Button>
                                        }
                                    </div>
                                </>
                            ) : (
                                <div className="w-full text-center">
                                    <p className="mb-2">
                                        You got {results.correctAnswers} out of {results.totalQuestions} questions correct.
                                    </p>
                                    <p className="mb-2">Your score: {results?.scorePercentage?.toFixed(2)}%</p>
                                    <p className="font-bold mb-4">Result: {results.result}</p>
                                    {
                                        results.result == "Fail" &&
                                        <Button onClick={() => setOpen(false)} className="mr-2">
                                            Go Back
                                        </Button>
                                    }

                                    {
                                        results.result != "Fail" &&
                                        <Button onClick={() => handelClick('pending')} className="mr-2">
                                            Continue
                                        </Button>
                                    }


                                </div>
                            )}
                        </>
                    }

                    {
                        !loading && error && <h1 className="text-center text-red-600 text-sm">{error}</h1>
                    }

                    {
                        loading && <h1 className="text-center">Loading...</h1>
                    }
                </>

            </div>

        </div>

    )
}

