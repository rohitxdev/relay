import { memo, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import styles from "./live-chat.module.scss";
import SendIcon from "@assets/icons/send.svg";
import { useRoomContext } from "@hooks";

export const LiveChat = memo(
  ({
    showLiveChat,
    setShowLiveChat,
    roomId,
    username,
  }: {
    showLiveChat: boolean;
    setShowLiveChat: React.Dispatch<React.SetStateAction<boolean>>;
    roomId: string;
    username: string;
  }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [message, setMessage] = useState<ChatMessage | null>(null);
    const [messagesList, setMessagesList] = useState<ChatMessage[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const messagesRef = useRef<HTMLDivElement | null>(null);
    const pageTitle = useMemo(() => document.title, []);
    const notificationCountRef = useRef(0);
    const {
      roomState: { showNotification },
      roomDispatch,
    } = useRoomContext();

    const typingUsersStatusText =
      typingUsers.length !== 0 &&
      (typingUsers.length > 1
        ? typingUsers.length <= 5
          ? typingUsers.join(", ") + " are typing..."
          : "5+ people are typing..."
        : typingUsers[0] + " is typing...");

    const socket = useMemo(
      () =>
        io(`ws://${location.host}`, {
          query: { roomId, username },
          reconnectionAttempts: 5,
        }),
      []
    );

    const inputHandler: React.FormEventHandler<HTMLInputElement> = (e) => {
      if (e.currentTarget.value.trim()) {
        setMessage({
          sender: username,
          type: "message",
          data: e.currentTarget.value,
          time: new Date().toISOString(),
        });
      } else {
        setMessage(null);
      }
    };

    const keyDownHandler: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
      if (e.key === "Enter") {
        sendMessageHandler();
      }
      if (e.key === "Escape") {
        setShowLiveChat(false);
      }
    };

    const sendMessageHandler = () => {
      if (message && socket.active) {
        socket.emit("text", message);
        setMessagesList((messages) => [...messages, message]);
        setMessage(null);
      }
    };

    useEffect(() => {
      if (showNotification) {
        roomDispatch({ type: "toggleNotification" });
        notificationCountRef.current = 0;
        document.title = pageTitle;
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
        socket.emit("not_typing");
      }
    }, [isTyping]);

    useEffect(() => {
      messagesRef.current?.scrollBy({ top: messagesRef.current.scrollHeight });
      if (!showNotification && !showLiveChat && messagesList.length >= 1) {
        if (messagesList.at(-1)?.sender !== username) {
          roomDispatch({ type: "toggleNotification" });
        }
      }
      document.onvisibilitychange = () => {
        if (showLiveChat) {
          notificationCountRef.current = 0;
          document.title = pageTitle;
        }
      };

      return () => {
        document.onvisibilitychange = null;
      };
    }, [messagesList]);

    useEffect(() => {
      socket.connect();

      socket.on("old_texts", (oldMessages: ChatMessage[]) => {
        if (messagesList.length === 0) {
          setMessagesList((messages) => messages.concat(oldMessages));
        }
      });

      socket.on("typing", (username: string) => {
        setTypingUsers((users) => [...users, username]);
      });

      socket.on("not_typing", (username: string) => {
        setTypingUsers((users) => users.filter((user) => user !== username));
      });

      socket.on("text", (message) => {
        setMessagesList((messages) => [...messages, message]);
        if (document.visibilityState === "hidden" || !showLiveChat) {
          ++notificationCountRef.current;
          document.title = `(${notificationCountRef.current > 9 ? "9+" : notificationCountRef.current}) ${pageTitle}`;
        }
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
        <div className={styles.messages} ref={messagesRef}>
          {messagesList.map((message) => {
            if (message.type === "meta") {
              return (
                <p className={styles.meta} key={message.sender + message.time}>
                  {message.data}
                </p>
              );
            }
            return (
              <div
                className={[styles.chatBubble, message.sender === username && styles.self].join(" ")}
                key={message.sender + message.time}
              >
                <div className={styles.text}>
                  {message.sender !== username && <p className={styles.sender}>{message.sender}</p>}
                  <p className={styles.data}>{message.data}</p>
                </div>
                <p className={styles.time}>
                  {new Date(message.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </p>
              </div>
            );
          })}
        </div>
        <p className={styles.typingUsersStatus}>{typingUsersStatusText}</p>
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
  }
);
