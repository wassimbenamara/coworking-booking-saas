import { useEffect, useState } from "react";

function App() {
  const [apiStatus, setApiStatus] = useState("Loading...");
const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((response) => response.json())
      .then((data) => {
        setApiStatus(data.status);
      })
      .catch(() => {
        setApiStatus("error");
      });
  }, []);

  return (
    <main>
      <h1>Coworking Booking SaaS</h1>

      <p>
        API status: <strong>{apiStatus}</strong>
      </p>
    </main>
  );
}

export default App;