const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getQuestions = async (): Promise<any[]> => {
  try {
    console.log(API_URL)
    const response = await fetch(`${API_URL}/api/questions`);
    if (!response.ok) {
      throw new Error(`Failed to fetch questions due to: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return []
  }
}

export default getQuestions;