import { memo, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import styles from "./live-chat.module.scss";
import SendIcon from "@assets/icons/send.svg";
import ChatIcon from "@assets/icons/chat.svg";

export const LiveChat = memo(({ roomId, username }: { roomId: string; username: string }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState<ChatMessage | null>(null);
  const [messagesList, setMessagesList] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const typingUsersDisplayText =
    typingUsers.length > 1 ? typingUsers.join(", ") + " are typing..." : typingUsers[0] + " is typing...";

  const socket = useMemo(
    () => io(`ws://${location.host}`, { query: { roomId, username }, reconnectionAttempts: 5 }),
    []
  );

  const inputHandler: React.FormEventHandler<HTMLInputElement> = (e) => {
    setMessage({
      sender: username,
      type: "message",
      data: e.currentTarget.value,
      time: new Date().toISOString(),
    });
  };

  const keyDownHandler: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      sendMessageHandler();
    }
  };

  const sendMessageHandler = () => {
    if (message && socket.connected) {
      socket.emit("text", message);
      setMessagesList((messages) => [...messages, message]);
      setMessage(null);
    }
  };

  const toggleLiveChatVisibility = () => {
    setShowLiveChat((state) => !state);
  };

  useEffect(() => {
    if (showNotification) {
      setShowNotification(false);
    }
  }, [showLiveChat]);

  useEffect(() => {
    if (message?.data) {
      !isTyping && setIsTyping(true);
    } else {
      isTyping && setIsTyping(false);
    }
  }, [message]);

  useEffect(() => {
    if (isTyping) {
      socket.emit("typing");
    } else {
      socket.emit("not-typing");
    }
  }, [isTyping]);

  useEffect(() => {
    messagesRef.current?.scrollBy({ top: messagesRef.current.scrollHeight });
    if (!showNotification && !showLiveChat) {
      if (messagesList.at(-1)?.sender !== username) {
        setShowNotification(true);
      }
    }
  }, [messagesList]);

  useEffect(() => {
    socket.connect();

    socket.on("old-texts", (oldMessages: ChatMessage[]) => {
      setMessagesList((messages) => messages.concat(oldMessages));
    });

    socket.on("typing", (username: string) => {
      setTypingUsers((users) => [...users, username]);
    });

    socket.on("not-typing", (username: string) => {
      setTypingUsers((users) => users.filter((user) => user !== username));
    });

    socket.on("text", (message) => {
      setMessagesList((messages) => [...messages, message]);
    });

    socket.on("join", (username: string) => {
      setMessagesList((messages) => [
        ...messages,
        { sender: username, type: "meta", data: `${username} joined.`, time: new Date().toISOString() },
      ]);
    });

    socket.on("leave", (username: string) => {
      setMessagesList((messages) => [
        ...messages,
        { sender: username, type: "meta", data: `${username} left.`, time: new Date().toISOString() },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className={[styles.liveChat, showLiveChat && styles.show].join(" ")}>
      <button
        className={[styles.chatBtn, showNotification && styles.showNotification].join(" ")}
        onClick={toggleLiveChatVisibility}
      >
        <ChatIcon />
      </button>
      <div className={styles.messages} ref={messagesRef}>
        {messagesList.map((message) => {
          if (message.type === "meta") {
            return (
              <h2 className={styles.typingUsersText} key={message.sender + message.time}>
                {message.data}
              </h2>
            );
          }
          return (
            <div
              className={[styles.chatBubble, message.sender === username && styles.self].join(" ")}
              key={message.sender + message.time}
            >
              <div>
                <p className={styles.sender}>{message.sender}</p>
                <p className={styles.data}>{message.data}</p>
                <p className={styles.time}>
                  {new Date(message.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <p className={styles.typingUsersText}>{typingUsers.length > 0 && typingUsersDisplayText}</p>
      <div className={styles.messageBox}>
        <input
          type="text"
          placeholder="Type your message here..."
          value={message?.data ?? ""}
          onInput={inputHandler}
          onKeyDown={keyDownHandler}
        />
        <button className={styles.sendBtn} onClick={sendMessageHandler}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
});
