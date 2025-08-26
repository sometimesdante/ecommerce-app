"use client"

import Link from "next/link";
import { login } from "../actions";
import { useState } from "react";

export default function Login() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const result = await login(formData);

    if (result.error) {
      console.log(error);
      setError(result.error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <span className="flex flex-col gap-2">
          <label>Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="customer@mail.com"
            required
            className="border-2 px-2 py-1 w-fit"
          />
        </span>
        <span className="flex flex-col gap-2">
          <label>Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            required
            className="border-2 px-2 py-1 w-fit"
          />
        </span>
        <span>
          {error &&
            <p className="text-slate-600">Failed to login, please try again.</p>
          }
        </span>
        <span className="flex gap-4">
          <button
            className="text-white bg-slate-600 rounded-md font-semibold px-4 py-2 w-fit"
            type="submit"
          >
            Log in
          </button>
        </span>
        <span>
          New user? Sign up <Link href="/auth/signup">here</Link>.
        </span>
      </form>
    </div>
  );
}
