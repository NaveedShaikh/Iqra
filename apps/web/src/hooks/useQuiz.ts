"use client"

import { useState, useCallback, useEffect } from "react"

type Question = {
  id: number
  type: "short" | "mcq" | "webrtc" | "sql"
  category: "General" | "WebRTC" | "SQL"
  question: string
  options?: string[]
  correctAnswer: string
  explanation?: string
}

const questions: Question[] = [
  {
    id: 1,
    type: "short",
    category: "General",
    question: "What is the capital of France?",
    correctAnswer: "Paris",
    explanation: "Paris is the capital and most populous city of France.",
  },
  {
    id: 2,
    type: "mcq",
    category: "General",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    explanation: "Mars is often called the Red Planet due to its reddish appearance in the night sky.",
  },
  {
    id: 3,
    type: "webrtc",
    category: "WebRTC",
    question: "What does ICE stand for in WebRTC?",
    correctAnswer: "Interactive Connectivity Establishment",
    explanation: "ICE (Interactive Connectivity Establishment) is a framework used in WebRTC for connecting peers.",
  },
  {
    id: 4,
    type: "sql",
    category: "SQL",
    question: 'Write a SQL query to select all columns from a table named "users".',
    correctAnswer: "SELECT * FROM users",
    explanation: "This query selects all columns (*) from the 'users' table.",
  },
  {
    id: 5,
    type: "webrtc",
    category: "WebRTC",
    question: "Which protocol does WebRTC primarily use for peer-to-peer communication?",
    options: ["HTTP", "WebSocket", "UDP", "TCP"],
    correctAnswer: "UDP",
    explanation: "WebRTC primarily uses UDP for real-time communication due to its lower latency compared to TCP.",
  },
  {
    id: 6,
    type: "sql",
    category: "SQL",
    question: "What SQL keyword is used to filter results in a SELECT statement?",
    options: ["FILTER", "WHERE", "HAVING", "CONDITION"],
    correctAnswer: "WHERE",
    explanation: "The WHERE clause is used to filter records in SQL queries.",
  },
  {
    id: 7,
    type: "webrtc",
    category: "WebRTC",
    question: "What is the purpose of STUN servers in WebRTC?",
    correctAnswer: "To help peers discover their public IP addresses and determine NAT type",
    explanation:
      "STUN (Session Traversal Utilities for NAT) servers help WebRTC peers discover their public IP addresses and determine the type of NAT they are behind.",
  },
  {
    id: 8,
    type: "sql",
    category: "SQL",
    question: "Which SQL function is used to return the current date?",
    options: ["GETDATE()", "CURRENTDATE()", "NOW()", "DATE()"],
    correctAnswer: "GETDATE()",
    explanation: "GETDATE() is a SQL Server function that returns the current date and time.",
  },
]

export function useQuiz() {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(60) // 60 seconds per question

  const handleAnswer = useCallback((id: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [id]: answer }))
  }, [])

  const calculateResults = useCallback(() => {
    let correct = 0
    questions.forEach((q) => {
      if (answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        correct++
      }
    })
    const score = (correct / questions.length) * 100
    const passed = score >= 70 // Pass if score is 70% or higher

    return { correct, total: questions.length, score, passed }
  }, [answers])

  const submitQuiz = useCallback(() => {
    setShowResults(true)
  }, [])

  const resetQuiz = useCallback(() => {
    setAnswers({})
    setShowResults(false)
    setCurrentQuestionIndex(0)
    setTimeRemaining(60)
  }, [])

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setTimeRemaining(60)
    } else {
      submitQuiz()
    }
  }, [currentQuestionIndex, submitQuiz])

  useEffect(() => {
    if (!showResults && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      nextQuestion()
    }
  }, [timeRemaining, showResults, nextQuestion])

  return {
    questions,
    currentQuestion: questions[currentQuestionIndex],
    answers,
    handleAnswer,
    submitQuiz,
    resetQuiz,
    nextQuestion,
    showResults,
    results: calculateResults(),
    timeRemaining,
    progress: ((currentQuestionIndex + 1) / questions.length) * 100,
  }
}

