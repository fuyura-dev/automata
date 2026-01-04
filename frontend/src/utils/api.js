const API_URL = import.meta.env.VITE_API_URL || "";

export const analyzeWordApi = async (word) => {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    body: JSON.stringify({ word: word }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export const fetchRootsApi = async () => {
  const response = await fetch(`${API_URL}/api/roots`);
  const result = await response.json();

  const sortedRoots = (result.words || []).slice().sort();

  return sortedRoots;
};
