import { trpc } from "@/app/lib/trpc-client";
import { useChatStore } from "@/app/store/chat";

export function MessageReactions({ messageId }: { messageId: number }) {
  const { reactions, updateReactions } = useChatStore();
  const reactMutation = trpc.chat.reactToMessage.useMutation();

  const handleReact = (type: "LIKE" | "DISLIKE") => {
    reactMutation.mutate(
      { messageId, userId: 1, type }, // Replace with authenticated user ID
      {
        onSuccess: (newReactions) => {
          const counts = newReactions.reduce((acc, r) => {
            acc[r.type] = r._count._all;
            return acc;
          }, {} as Record<string, number>);
          updateReactions(messageId, {
            dislike: counts.dislike || 0,
            like: counts.like || 0,
          });
        },
      }
    );
  };

  return (
    <div className="flex space-x-2">
      <button onClick={() => handleReact("LIKE")}>👍 {reactions[messageId]?.like || 0}</button>
      <button onClick={() => handleReact("DISLIKE")}>
        👎 {reactions[messageId]?.dislike || 0}
      </button>
    </div>
  );
}
