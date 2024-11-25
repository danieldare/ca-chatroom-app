"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TRPCClientError } from "@trpc/client";
import cookies from "js-cookie";
import { useUserStore } from "../../store/useUserStore";
import { trpc } from "@/app/server/lib/trpc-client";

export default function Page() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { mutateAsync, isLoading } = trpc.user.signIn.useMutation();
  const setUser = useUserStore((state) => state.setUser);


  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username) {
      setError("Username is required");
      return;
    }
    setError("");
    try {
      const user = await mutateAsync({ username });
      console.log("user", user)
      cookies.set('user', JSON.stringify(user), { expires: 1 / 24 }); // 1 hour
      setUser(user!);
      router.push('/chatrooms');
    } catch (error) {
      if (error instanceof TRPCClientError) {
        setError(error.message || "Sign-in failed");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="pattern-cross pattern-blue-500 pattern-bg-white 
  pattern-size-6 pattern-opacity-40"></div>
      <h1 className="text-[30px] text-[#239723] font-bold my-4">Mingle Rooms</h1>
      <div className="bg-[#42414134] p-6 rounded-lg drop-shadow-lg w-full max-w-[450px]">
        <div className="mb-10">
          <h3 className="text-lg font-bold text-[#239723]">Sign In</h3>
          <p className="text-[#d4d3d3] text-sm my-1">Enter your username to join our chat rooms</p>
        </div>

        <form onSubmit={handleSignIn}>
          <label htmlFor="username" className="block text-sm text-[#bab8b8] mt-4">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter username"
            disabled={isLoading}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-[#75e164] p-2 mt-1 w-full bg-[#35343498]"
          />
          {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
          <button disabled={isLoading} type="submit" className="mt-4 text-sm bg-[#239723] text-white px-4 py-2 rounded">
            {!isLoading ? "Sign In" : "loading..."}
          </button>
        </form>
      </div>
    </div>
  );
}
