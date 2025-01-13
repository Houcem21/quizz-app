"use client"
import React, {useState} from 'react'
import Header from '../ui/components/Header';

export default function AdminDashboard() {

    const [formData, setFormData] = useState({
        question: "",
        answers: ["", "", "", ""],
        correctAnswer: "",
        category: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleAnswerChange = (index: number, value: string) => {
        const updatedAnswers = [...formData.answers];
        updatedAnswers[index] = value;
        setFormData({...formData, answers: updatedAnswers});
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/questions`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            alert("Question was added!")
            setFormData({
                question: "",
                answers: ["", "", "", ""],
                correctAnswer: "",
                category: ""
            });
        }
        else {
            alert("Question was NOT added!")
        }  
    };

    return (
    <><Header />
    <div className="p-10">
      
      <h1 className="text-5xl mb-5 text-center">Add a Question</h1>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <input
          name="question"
          value={formData.question}
          onChange={handleChange}
          placeholder="Question"
          className="p-5 border bg-secondary-color text-3xl"
        />
        {formData.answers.map((answer, index) => (
          <input
            key={index}
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder={`Answer ${index + 1}`}
            className="p-5 border bg-secondary-color text-3xl"
          />
        ))}
        <input
          name="correctAnswer"
          value={formData.correctAnswer}
          onChange={handleChange}
          placeholder="Correct Answer"
          className="p-5 border bg-secondary-color text-3xl"
        />
        <select name="category" value={formData.category} onChange={handleChange} className="p-5 border bg-secondary-color text-3xl">
          <option value="">Select Category</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="General">General</option>
        </select>
        <button type="submit" className="p-8 bg-tertiary-color text-white text-3xl bg-primary-color-on-active">Submit</button>
      </form>
    </div>
    </>
    )

}