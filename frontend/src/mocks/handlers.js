import { http, HttpResponse } from "msw";
import { auth } from "../services/firebase";

export const handlers = [
  http.get("/api/messages", () => {
    const currentUser = auth.currentUser;
    const uid = currentUser ? currentUser.uid : "";
    return HttpResponse.json([
      {
        user_id: "tarou",
        message: "Hello, world!",
        timestamp: Date.now(),
        email: "test@example.com",
      },
      {
        user_id: uid,
        message: "Hi, there!",
        timestamp: Date.now(),
        email: "",
      },
    ]);
  }),
  http.post("/api/messages", async ({ request }) => {
    const { message } = await request.json();
    console.log(message);
    return HttpResponse.json({
      user_id: "tarou",
      message: message,
      timestamp: Date.now(),
      email: "",
    });
  }),
  http.post("/api/messages/stream", async ({ request }) => {
    const { user_id, message } = await request.json();
    return HttpResponse.json({
      user_id,
      message,
      timestamp: Date.now(),
      email: "",
    });
  }),
];
