import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }
        return response.json();
      })
      .then((data) => {
        setMessage(`Backend status: ${data.status}`);
      })
      .catch(() => {
        setMessage("Could not connect to Python backend.");
      });
  }, []);

  return (
    <main>
      <h1>Student Loan Planner</h1>
      <p>Plan your student debt before graduation.</p>
      <p>{message}</p>
    </main>
  );
}

export default App;

