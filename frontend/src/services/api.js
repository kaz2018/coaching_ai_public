const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function talktovertex(token, messages) {
  try {
    //console.log("messages: ", messages);
    const response = await fetch(`/api/talktovertex`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    //console.log("response.json(): ", response.json());
    return response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function sendMessage(token, message) {
  try {
    const response = await fetch(`/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function fetchMessages(token) {
  try {
    const response = await fetch(`/api/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

export async function fetchProfile(token) {
  try {
    const response = await fetch(`/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

export async function deleteMessages(token) {
  try {
    const response = await fetch(`/api/messages`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting messages:", error);
    throw error;
  }
}
