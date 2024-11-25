"use client";
import { useRouter } from "next/navigation";
import { useUserStore } from "./(client)/store/useUserStore";

export default function Page() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-900 text-white p-4">
      <h3 className="text-xl font-bold mb-5">Welcome to CA chatroom app</h3>
      {user ? (
        <button onClick={() => router.push("/chatrooms")} className="bg-[#239723] text-white px-4 py-2 rounded">Continue to chatroom</button>
      ) : (
        <button  onClick={() => router.push("/sign-in")} className="bg-[#239723] text-white px-4 py-2 rounded">Sign in</button>
      )}
    </div>
  );
}
