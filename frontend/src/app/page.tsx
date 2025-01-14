"use client"
import { useState, useEffect } from "react";
import { HomeIcon } from "@/assets";
import Header from "./ui/components/Header";
import getQuestions from "@/data/api";
import Image from "next/image";


export default function Home() {

  interface Question {
    question: string;
    answers: string[];
    correctAnswer: string;
    category: string;
}

  //Get the questions
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  const segmentQuestions = (questions:Question[], segmentCount:number) => {
    const questionList = [];
    for (let i = 0; i < segmentCount; i++) {
      questionList.push(questions[Math.floor(Math.random() * questions.length)]);
    }
    return questionList || [];
  }
  
  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await getQuestions();
      ;
      setQuestions(segmentQuestions(data, 5));
    };
    fetchQuestions();
  }, [])

  const currentQuestion = questions[questionIndex] || {question: "Loading...", answers: []};
  
  //Listen to the answer
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const AnswerButton = (answer: string, key: number) =>
    <button onClick={() => {setSelectedAnswer(answer)}} className={`answer min-w-60 rounded-xl p-5 bg-primary-color-on-hover ${selectedAnswer===answer ? 'bg-primary-color' : 'bg-secondary-color'}`} key={key} >
      <p className="text-3xl">{answer}</p>
    </button>

  
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  //Update the selected answers list
  function onSubmitAnswer(e: React.FormEvent) {
    e.preventDefault();
    setSelectedAnswers((prevAnswers) => [...prevAnswers, selectedAnswer])
    console.log(selectedAnswers.length);
    //Advance to the next page
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedAnswer("");
    }
    else {
      console.log("Quizz complete! You scored: " + calculateScore(selectedAnswers))
    }
  }


  const AnswerSheet = (answers: string[]) => 
    <div className={`absolute top-0 bottom-0 right-0 left-0 flex justify-center items-center right-0 ${answers.length === questions.length ? "block" : "hidden"}`}>
      <div className={`opacity-[.6] bg-black h-screen w-screen absolute`} />
      <div className="bg-secondary-color opacity-[1] z-10 flex justify-center items-center overflow-hidden">
        <ul className="flex justify-between bg-secondary-color items-center w-[80%] h-24 text-xl py-20  gap-20 overflow-x-scroll overflow-y-hidden">
          {answers.map((answer, index) => <li className={`text-5xl p-5 ${answer === questions[index].correctAnswer ? "bg-green-700" : "bg-red-700"}`} key={index}>{answer}</li>)}
        </ul>
      </div>
      <div className="h-40 w-60 flex justify-center items-center bg-secondary-color absolute bottom-40 text-7xl">{calculateScore(selectedAnswers)} / {questions.length}</div>
      <div className="close-icon absolute w-screen top-20 z-10 flex justify-center items-center cursor-pointer"><a href="./"><Image src={HomeIcon} alt="home-icon" height={200} /></a></div>
    </div>

  function calculateScore(answers: string[]) {
    let score = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) score++;
    })
    return score;
  }

  return (
    <div className={`flex flex-col text-center h-screen w-full justify-between`}>
      <Header />
      <main className="grid gap-10 max-h-fit-content">
        <section className="question-container">
          <h1 className="text-5xl uppercase px-5">{currentQuestion.question}</h1>
        </section>
        <section className="answers-container grid text-center gap-10 justify-center items-center">
          {currentQuestion.answers.map((answer: string, index: number) => AnswerButton(answer, index))}
        </section>
      </main>
      <footer className="h-24 submit-btn-container w-screen">
        <button onClick={onSubmitAnswer} className="uppercase text-5xl bg-tertiary-color p-5 rounded tracking-widest w-screen h-[100%] cursor-pointer bg-primary-color-on-active">submit</button>
      </footer>
      {(questionIndex> 0) && AnswerSheet(selectedAnswers)}
    </div>
  );
}
