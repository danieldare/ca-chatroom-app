"use client";

import { useRouter } from "next/navigation";
import { Spinner } from "@/app/(client)/components/spinner";
import { useUserStore } from "../../store/useUserStore";
import { trpc } from "@/app/server/lib/trpc-client";

export default function ChatroomsPage() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const { data: chatrooms, isLoading } = trpc.chat.list.useQuery();
  const joinMutation = trpc.chat.join.useMutation();
  // const onNewMessage = trpc.chat.onNewMessage.useSubscription();

  // useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:8080");

  //   ws.onmessage = (event) => {
  //     const message = JSON.parse(event.data);
  //     if (message.type === "update") {
  //       refetch();
  //     }
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, [refetch]);

  const joinRoom = async (roomId: number) => {
    if (user) {
      await joinMutation.mutateAsync({ chatroomId: roomId, userId: user.id });
      router.push(`/chatrooms/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-4xl p-4 flex flex-col items-center justify-center">
        <div className="mb-8 text-center">
          {user && <h1 className="text-2xl font-bold">Welcome, {user?.username}</h1>}
          <p className="text-gray-400 text-sm">Chat with your friends anywhere and anytime!</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-5 w-full">
          {isLoading ? (
            <Spinner />
          ) : (
            chatrooms?.map((room) => (
              <button
                key={room.id}
                className="w-full sm:w-52 p-4 h-full sm:h-28 flex hover:scale-[1.05] transition-transform ease-in-out rounded-lg flex-col justify-center items-center border border-[#239723]"
                onClick={() => joinRoom(room.id)}
              >
                <h3 className="text-lg font-bold">{room.name}</h3>
                <p className="text-gray-400 text-sm">
                  <span className="text-[#239723]">{room.userCount}</span> user
                  {room.userCount > 1 ? "s" : ""}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
