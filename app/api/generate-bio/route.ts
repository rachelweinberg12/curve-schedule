import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, title } = await request.json();

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "<examples>\n<example>\n<NAME>\nMark Beall\n</NAME>\n<CURRENT_TITLE>\nCo-founder of Gladstone AI\n</CURRENT_TITLE>\n<ideal_output>\nI'm an average American, tech start-up CEO, and former senior U.S. defense official. I'm a founder of [Gladstone AI](https://www.gladstone.ai/), a company that aims to promote the responsible development and adoption of AI by providing safeguards against AI-driven national security threats, such as weaponization and loss of control. Before founding Gladstone, I was the head of AI policy at the Pentagon.\n</ideal_output>\n</example>\n<example>\n<NAME>\nAjeya Cotra\n</NAME>\n<CURRENT_TITLE>\nSenior Program Officer at Open Philanthropy\n</CURRENT_TITLE>\n<ideal_output>\nI lead [Open Phil](https://www.openphilanthropy.org/)’s grantmaking on technical research that could help to clarify and reduce catastrophic risks from advanced AI. As part of this role, I conduct analysis on threat models (ways that advanced AI could cause catastrophic harm) and technical agendas (technical work that may help to address these threat models). I also write and edit at [Planned Obsolescence](https://www.planned-obsolescence.org/). Lately, I've been on sabbatical from Open Phil and I've gotten really interested talking to people with very different views on AI, and trying to figure out why they disagree.\n</ideal_output>\n</example>\n</examples>\n\n",
            },
            {
              type: "text",
              text: `You are tasked with generating a brief professional bio for an attendee of an AI conference. Your goal is to create an informative and concise biography based on publicly available information. Follow these steps:\n\n1. You will be provided with the following information:\n<name>${name}</name>\n${
                title ? `\n<current_title>${title}</current_title>\n` : ""
              }\n2. Using this information, search for publicly available data about the person. Focus on their professional history and work related to AI.\n\n3. When writing the bio, adhere to these guidelines:\n   - Emphasize the person's current project(s) and area(s) of interest\n   - Include their current role and any significant and recent past positions\n   - Mention notable projects, publications, or contributions\n   - Keep the tone friendly, professional, and humble\n\n4. The bio should be approximately 50-100 words long\n\n5. The bio can be formatted in markdown. In particular, use bullet points if they'd help clarify a list, and use hyperlinks if you mention something highly relevant and recent that can be easily linked to, for example their organization, their blog, or their current project.\n\n6. Return the bio inside of <bio> tags.\n\n7. If the name is common and you find multiple individuals with similar credentials:\n   - Use the provided current title to narrow down your search\n   - Focus on individuals with a background in AI or related fields\n   - If still uncertain, mention this in your response and provide the most likely match\n\n8. If you cannot find sufficient information to create a meaningful bio:\n   - State this in your response\n   - Provide a brief explanation of why (e.g., limited public information, ambiguity due to a common name)\n\n9. After the bio, include a brief note about the sources of information within <sources> tags. Do not include specific URLs, just mention general sources (e.g., professional networking sites, academic databases, company websites).\n\nRemember, this bio will be used for conference purposes, so maintain a professional tone and focus on the individual's AI-related work and achievements.`,
            },
          ],
        },
      ],
    });
    console.log(msg);
    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    const bio = extractBio(text);

    return NextResponse.json({ bio });
  } catch (error) {
    console.error("Error generating bio:", error);
    return NextResponse.json(
      { error: "Failed to generate bio" },
      { status: 500 }
    );
  }
}

type ClaudeResponse = {
  type: string;
  text: string;
};

function extractBio(text: string): string {
  // Modified regex that works with older JavaScript versions
  const bioRegex = /<bio>[\r\n]*([\s\S]*?)[\r\n]*<\/bio>/;

  const match = text.match(bioRegex);

  if (!match) {
    throw new Error("No bio content found between <bio> tags");
  }

  // Return the captured content (first capture group)
  return match[1].trim();
}
