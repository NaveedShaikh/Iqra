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

export default function QuizDialog({ open, setOpen, handelClick }: { open: boolean, setOpen: (open: boolean) => void, handelClick: () => void; }) {
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
    } = useQuiz()

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            resetQuiz()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Knowledge Quiz</DialogTitle>
                    <DialogDescription>Test your knowledge on various topics including WebRTC and SQL.</DialogDescription>
                </DialogHeader>
                {!showResults ? (
                    <>
                        <div className="mb-4">
                            <Progress value={progress} className="w-full" />
                        </div>
                        <div className="grid gap-4 py-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">
                                    Question {currentQuestion?.id} of {results.total}
                                </span>
                                <span className="text-sm text-muted-foreground">Time left: {timeRemaining}s</span>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`question-${currentQuestion?.id}`} className="font-medium">
                                    {currentQuestion?.question}
                                </Label>
                                {currentQuestion?.type === "sql" ? (
                                    <Textarea
                                        id={`question-${currentQuestion?.id}`}
                                        value={answers[currentQuestion?.id] || ""}
                                        onChange={(e) => handleAnswer(currentQuestion?.id, e.target.value)}
                                        placeholder="Enter your SQL query here"
                                    />
                                ) : currentQuestion?.options ? (
                                    <RadioGroup
                                        onValueChange={(value) => handleAnswer(currentQuestion?.id, value)}
                                        value={answers[currentQuestion?.id] || ""}
                                    >
                                        {currentQuestion?.options.map((option) => (
                                            <div key={option} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option} id={`${currentQuestion?.id}-${option}`} />
                                                <Label htmlFor={`${currentQuestion?.id}-${option}`}>{option}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                ) : (
                                    <Input
                                        id={`question-${currentQuestion?.id}`}
                                        value={answers[currentQuestion?.id] || ""}
                                        onChange={(e) => handleAnswer(currentQuestion?.id, e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={nextQuestion}>{currentQuestion?.id === results.total ? "Submit" : "Next"}</Button>
                        </DialogFooter>
                    </>
                ) : (
                    <div className="w-full text-center">
                        <p className="mb-2">
                            You got {results.correct} out of {results.total} questions correct.
                        </p>
                        <p className="mb-2">Your score: {results.score.toFixed(2)}%</p>
                        <p className="font-bold mb-4">Result: {results.passed ? "Pass" : "Fail"}</p>
                        {
                            !results.passed &&
                            <Button onClick={resetQuiz} className="mr-2">
                                Try Again
                            </Button>
                        }

                        {
                            results.passed &&
                            <Button onClick={handelClick} className="mr-2">
                                Continue
                            </Button>
                        }

                        
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

