export interface ChatMessage {
  sender: string;
  type: "message" | "meta";
  data: string;
  time: string;
}
