"use client";
import { useRouter } from "next/navigation";
import cookies from "js-cookie";
import { useUserStore } from "../store/useUserStore";

export const Navbar = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const handleLogout = () => {
    cookies.remove("::chat-app-user::");
    cookies.remove("user");
    router.push("/sign-in");
  };

  return (
    <div className="h-[60px] w-full z-10 flex justify-between items-center px-4 bg-gray-800 text-white">
      {user ? <p>Welcome, {user?.username}</p> : <div />}

      <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
};
