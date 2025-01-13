"use client"
import { useState } from "react";
import Header from "./ui/components/Header";

export default function Home() {

  const [selectedAnswer, setSelectedAnswer] = useState("");

  const answers = ["one", "two i think", "only one", "maybe 4 or more"]

  const AnswerButton = (answer: string, key: number) =>
    <button onClick={() => setSelectedAnswer(answer)} className={`answer minw-[100] rounded-xl p-5 bg-primary-color-on-hover ${selectedAnswer===answer ? 'bg-primary-color' : 'bg-secondary-color'}`} key={key} >
      <p className="text-3xl">{answer}</p>
    </button>
  
  

  return (
    <div className={`inline-grid text-center h-screen w-full`}>
      <Header />
      <main className="grid gap-10 py-20">
        <section className="question-container">
          <h1 className="text-5xl uppercase px-5">How many knots are there in a half knot?</h1>
        </section>
        <section className="answers-container grid text-center gap-10 justify-center items-center">
          {answers.map((answer, index) => AnswerButton(answer, index))}
        </section>
      </main>
      <footer className="submit-btn-container w-screen">
        <button type="submit" className="uppercase text-5xl bg-tertiary-color p-5 rounded tracking-widest w-screen h-full">submit</button>
      </footer>
    </div>
  );
}
