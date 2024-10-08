# Custom AI Chatbot Creator

## Deployed Site

Check out the deployed application [here](https://custom-chatbots-3s7uxppv7-wendys-projects-2720c50a.vercel.app/login)!

## Technologies

- **React**
- **Next.js**
- **TypeScript**
- **PostgreSQL**
- **GraphQL API**
- **Groq API** (formerly OpenAI API)

## Description

Custom AI Chatbot Creator, inspired by Sonny Sangha's AI Help Bot, allows users to build and customize AI chatbots. The project integrates the Groq API due to the discontinuation of free access to the OpenAI API and includes updates to PostgreSQL queries and mutations to resolve errors from the original implementation.

## New Features
  
- **Added Prompt Suggestions**: I designed and coded a new AI feature where I generate and show tailored prompt suggestions using Groq API based on the chatbot's characteristics.
  
- **Suggestion Button During Chat**: During chats, users can also benefit from the AI prompt suggestion with a suggestion button that provides prompt suggestions, enhancing the flow of the conversations.

- **Update User Authentication**: Users now have the option to sign in with Email or continue as a guest. The sign-in prompt is strategically placed after users send their message, offering them the chance to explore the chatbot and see what kind of prompt it can answer before having to sign in.
  
- **Update Page Layouts**: I've redesigned the layouts for various pages and reorganized the folder structure to provide a more detailed and user-friendly experience for interacting with chatbots.

## Getting Started

To start the development server, run:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
