const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Question {
  question: string;
  answers: string[];
  correctAnswer: string;
  category: string;
}

const getQuestions = async (): Promise<Question[]> => {
  try {
    console.log(API_URL)
    const response = await fetch(`${API_URL}/api/questions`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch questions due to: ${response.statusText}`)
    }
    const data = await response.json();
    console.log("Database has " + data.length + " entries.");
    return data;
  } catch (error) {
    console.log(error);
    return []
  }
}

export default getQuestions;