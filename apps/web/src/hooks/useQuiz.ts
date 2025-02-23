"use client"

import { result } from "lodash"
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


const QUE_SERVER_URL = "http://139.59.78.160:3000"


function evaluateQuiz(answers:any, passingThreshold = 0.5) {
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter((answer:any) => answer.isCorrect).length;
  
  const scorePercentage = (correctAnswers / totalQuestions) * 100;
  const result = (correctAnswers / totalQuestions) >= passingThreshold ? "Pass" : "Fail";

  return {
      totalQuestions,
      correctAnswers,
      scorePercentage,
      result
  };
}

export function useQuiz(quizConfig: any,handelClick:(status:string) => void) {
  const [useranswers, setUserAnswers] = useState<Record<number, string>>({})
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [result, setResult] = useState({});
  const [submitLoading,setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);


  const startAssessment = async () => {
    console.log('calling....')
    setLoading(true);
    try {
      const processedConfig = {
        ...quizConfig,
        keywords: quizConfig.keywords
          .split(',')
          .map((keyword: any) => keyword.trim())
          .filter((keyword: any) => keyword.length > 0)
      };

      const response = await fetch(`/api/quiz/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedConfig)
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // Add IDs to questions
      const questionsWithIds = data.questions.map((q: any, index: number) => ({
        ...q,
        id: `q${index + 1}`
      }));
      setQuestions(questionsWithIds);
      // Initialize answers object with empty values
      const initialAnswers = {};
      questionsWithIds.forEach((q: any) => {
        initialAnswers[q.id] = '';
      });
      setUserAnswers(initialAnswers);

      console.log('calling....', data.questions)
    } catch (err: any) {
      console.log('calling....', err.message)
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };


  //get question
  useEffect(() => {
    if (quizConfig) {
      console.log('aaaaa')
      startAssessment();
    }
  }, [quizConfig]);
  const handleAnswer = useCallback((id: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [id]: answer }))
  }, []);



  const submitQuiz = useCallback(async () => {

    setSubmitLoading(true)
    try {
      const submissionData = questions.map(question => ({
        questionId: question.id,
        question: question.question,
        type: question.type,
        difficulty: question.difficulty,
        options: question.options || [],
        userAnswer: useranswers[question.id] || ''
      }));
;
      const formdata = {
        submissionData
      }
      const response = await fetch('/api/quiz/answers', {
        method: 'POST',
        body: JSON.stringify(formdata)
      });

      const data = await response.json();
      console.log("data after assesment", data);
      if (data.error) {
        throw new Error(data.error);
      }


      const result = evaluateQuiz(data.evaluations)
      if(result.result == "Fail"){
        await handelClick("rejected")
      }
      setResult(result)
      setShowResults(true)
    } catch (error:any) {
      console.log(error.message)
    }finally{
      setSubmitLoading(false)
    }
  }, [questions, useranswers])

  const resetQuiz = useCallback(() => {
    setAnswers({})
    setShowResults(false)
    setCurrentQuestionIndex(0)
  }, [])

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      submitQuiz()
    }
  }, [currentQuestionIndex, submitQuiz, questions]);


  const handleAnswerChange = (questionId: any, answer: any) => {
    console.log(questionId, answer, useranswers)
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  return {
    questions,
    currentQuestion: questions[currentQuestionIndex],
    answers,
    handleAnswer,
    submitQuiz,
    resetQuiz,
    nextQuestion,
    showResults,
    timeRemaining,
    results: result,
    loading,
    currentQuestionIndex,
    useranswers,
    handleAnswerChange,
    submitLoading,
    progress: ((currentQuestionIndex + 1) / questions.length) * 100,
    error
  }
}

