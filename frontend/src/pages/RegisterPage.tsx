import { useState } from "react";
import { registerUser } from "../services/auth.service";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setIsLoading(true);

    try {
      await registerUser({
        firstName,
        lastName,
        email,
        password,
      });

      setMessage("Account created successfully.");

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "EMAIL_ALREADY_EXISTS") {
          setMessage("An account already exists with this email.");
        } else if (error.message === "INVALID_DATA") {
          setMessage("Please check the information provided.");
        } else {
          setMessage("Unable to create the account.");
        }
      } else {
        setMessage("Unable to create the account.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <h1>Create an account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
