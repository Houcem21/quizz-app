const getQuestions = async (): Promise<any[]> => {
  try {
    const response = await fetch(`http://localhost:5001/api/questions`);
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