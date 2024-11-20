import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { messageContent, title } = (await request.json()) as {
    messageContent: string;
    title: string;
  };

  const botToken = process.env.BOT_TOKEN;
  const channelId = process.env.CHANNEL_ID;

  const messageResponse = await fetch(
    `https://discord.com/api/v9/channels/${channelId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: messageContent,
      }),
    }
  );

  if (messageResponse.ok) {
    const messageData = await messageResponse.text();
    const message = JSON.parse(messageData);
    // Create thread using the message ID we just got
    const threadResponse = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages/${message.id}/threads`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `Q&A: ${title.slice(0, 50)}`,
          auto_archive_duration: 1440,
        }),
      }
    );
    if (threadResponse.ok) {
      console.log(`Successfully created thread for session: ${title}`);
      const threadData = await threadResponse.json();
      console.log("Thread data:", threadData);
    } else {
      const errorText = await threadResponse.text();
      console.error(
        `Failed to create thread. Status: ${threadResponse.status}`
      );
      console.error("Error:", errorText);
    }
  } else {
    console.error("failed to send message");
    return Response.error();
  }
  return Response.json({ success: true });
}
