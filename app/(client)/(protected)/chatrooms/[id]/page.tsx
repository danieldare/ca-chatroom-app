"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Message, OnlineUsersMessage, SystemMessage } from "@/app/types";
import { Spinner } from "@/app/(client)/components/spinner";
import { trpc } from "@/app/server/lib/trpc-client";
import { useUserStore } from "@/app/(client)/store/useUserStore";

export default function ChatroomPage() {
  const params = useParams<{ id: string }>();
  const chatroomId = parseInt(params.id, 10);
  const [messages, setMessages] = useState<Message[] | SystemMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsersMessage["users"]>([]);
  const loggedInuser = useUserStore((state) => state.user);
  const leaveMutation = trpc.chat.leave.useMutation();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { data: roomDetails, isFetching: isLoadingRoomDetails } = trpc.chat.getRoomDetails.useQuery(
    { chatroomId },
  );

  const { data: previousMessages, isFetching: isLoadingPreviousMessages } =
    trpc.chat.getMessages.useQuery({ chatroomId });

  const { data: initialOnlineUsers } = trpc.chat.getOnlineUsers.useQuery({ chatroomId });

  useEffect(() => {
    if (previousMessages) {
      setMessages(previousMessages);
    }
  }, [previousMessages]);

  useEffect(() => {
    if (initialOnlineUsers) {
      setOnlineUsers(initialOnlineUsers);
    }
  }, [initialOnlineUsers]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  trpc.chat.onNewMessage.useSubscription(
    { chatroomId },
    {
      onData(message) {
        setMessages((prev) => [...prev, message]);
      },
    }
  );

  trpc.chat.onUpdate.useSubscription(
    { chatroomId },
    {
      onData(update) {
        console.log("update", update);
        // Handle update event
      },
    }
  );

  trpc.chat.onReaction.useSubscription(
    { chatroomId },
    {
      onData(reaction) {
        // Handle reaction event
      },
    }
  );

  trpc.chat.onUserJoined.useSubscription(
    { chatroomId },
    {
      onData({ userId, username }) {
        setOnlineUsers((prev) => [...prev, { id: userId, username }]);
      },
    }
  );

  trpc.chat.onUserLeft.useSubscription(
    { chatroomId },
    {
      onData({ userId }) {
        setOnlineUsers((prev) => prev.filter((user) => user.id !== userId));
      },
    }
  );

  const leaveRoom = async () => {
    if (loggedInuser) {
      await leaveMutation.mutateAsync({ chatroomId, userId: loggedInuser.id });
      router.push("/chatrooms");
    }
  };

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      try {
        await sendMessageMutation.mutateAsync({
          chatroomId,
          userId: loggedInuser?.id,
          content: newMessage,
        });
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  console.log("onlineUsers",onlineUsers)

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-1/4 bg-gray-800">
        <div className="sticky h-screen justify-between bottom-0 p-3 bg-[#272e3f] left-0 flex flex-col">
          <div className="text-center">
            <div className="my-8">
            <h2 className="text-xl text-center text-[#239723] font-bold">{roomDetails?.name}</h2>
            <p>Welcome, {loggedInuser?.username}</p>
            </div>
            <hr className="my-20 border-gray-700 " />
            <div className="mt-10 text-center">
              <p>Online friends</p>
              <ul className="text-center mt-1">
                {onlineUsers?.map((user) => (
                  <li key={user.id} className="py-1">
                    {user.username} {user.id === loggedInuser?.id}{"you"}
                    <span className="h-2 ml-1 w-2 inline-flex rounded-full bg-lime-500" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <hr className="my-20 border-gray-700 " />

          <button
            type="button"
            onClick={leaveRoom}
            className="bg-red-600  text-white px-4 py-2 rounded text-sm"
          >
            Leave Room
          </button>
        </div>
      </div>
      <div className="flex flex-col w-3/4 bg-gray-900 relative">
        <div className="flex-grow p-4 overflow-y-auto">
          {isLoadingPreviousMessages ? (
            <div className="flex justify-center w-full h-full items-center">
              <Spinner />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center w-full h-full items-center">
              <p className="text-gray-400">Hello, {loggedInuser?.username}, Start a conversation</p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <>
                  {msg.content === "sysytem" ? (
                    <p className="text-center text-xs italic">{msg.content}</p>
                  ) : (
                    <>
                      <div
                        key={index}
                        className={`py-1 px-3 rounded mb-2 max-w-xs ${
                          msg.type === "system"
                            ? "mx-auto bg-gray-600 text-white"
                            : msg.userId === loggedInuser?.id
                            ? "ml-auto bg-[#3cd53c39] text-white"
                            : "mr-auto bg-gray-700 text-white"
                        }`}
                      >
                        <p className="font-bold text-xs text-muted">{msg.username}</p>
                        <p>{msg.content}</p>
                        <p className="text-[11px] text-gray-400 justify-end justify-self-end">
                          {new Date(msg.createdAt).toLocaleTimeString()}{" "}
                        </p>
                      </div>
                      {msg.content !== "sysytem" && <div className="" ref={messagesEndRef} />}
                    </>
                  )}
                </>
              ))}
            </>
          )}
        </div>
        <form onSubmit={handleSendMessage}>
          <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center gap-2 fixed bottom-0 w-3/4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="border border-gray-600 p-2 flex-grow bg-gray-700 text-white"
              placeholder="Type your message..."
            />
            <button type="submit" className="bg-[#239723] text-white px-4 py-2 rounded text-sm">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
