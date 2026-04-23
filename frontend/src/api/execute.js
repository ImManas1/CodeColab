export const executeCode = async (code, language) => {
  try {
    const res = await fetch("http://localhost:5000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });
    return await res.json();
  } catch {
    throw new Error("Error connecting to execution server. Ensure backend is running.");
  }
};
