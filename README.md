# Real-Time Voice Transcriber v.25

# SPDX-License-Identifier: MIT

#

# Author: Kevin Keihani

# Company: Soroush Fanavari Co

# Contact: yz.keihani@gmail.com

# GitHub: https://github.com/keihani

# LinkedIn: https://linkedin.com/in/keihani

This is a web application that provides real-time voice transcription using Google's Gemini Live API. It can capture audio from a user's microphone or directly from the system's audio output, making it a versatile tool for transcribing meetings, lectures, videos, and more.

![Application Screenshot](https://media.licdn.com/dms/image/v2/D4D22AQGzBKSFv7THuA/feedshare-shrink_1280/B4DZo8NQ8EJUAs-/0/1761946704655?e=1763596800&v=beta&t=AWjjOCzL7HV-MZI7UJdxkTTGvjZyQyiogWTeQBw2oOo)

---

## Features

- **Real-Time Transcription:** Get live, streaming transcription of spoken words.
- **Dual Audio Sources:** Seamlessly switch between transcribing from your **Microphone** or **System Audio**.
- **Modern & Responsive UI:** A clean, intuitive interface built with Tailwind CSS that works great on all screen sizes.
- **Clear Status Indicators:** Always know the current state of the application, whether it's `Idle`, `Connecting`, `Listening`, or has encountered an `Error`.
- **Easy Controls:** Simple "Start" and "Stop" functionality.
- **Built-in Help & About:** On-screen guides to help users get started and provide information about the project and author.
- **Robust Error Handling:** Clear error messages to help diagnose issues (e.g., missing permissions for system audio).

## Tech Stack

- **Frontend:** [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- **APIs:** Web Audio API, `getUserMedia`, `getDisplayMedia`

## Getting Started

To run this project locally, you'll need to have [Node.js](https://nodejs.org/) installed.

### 1. Clone the Repository

```bash
git clone https://github.com/keihani/voice-transcriber.git
cd voice-transcriber
```

### 2. Install Dependencies

This project uses `npm` to manage dependencies.

```bash
npm install
```

### 3. Set up your API Key

The application requires a Google Gemini API key to function.

1.  Create a `.env` file in the root of your project.
2.  Add your API key to the `.env` file like this:

    ```
    VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

    _Note: If you are not using Vite, you may need to adjust the environment variable name and how it's loaded into the application (e.g., `REACT_APP_GEMINI_API_KEY` for Create React App)._

### 4. Run the Development Server

```bash
npm run dev
```

The application should now be running on your local server (usually `http://localhost:5173`).

## Project Structure

```
/
├── components/         # Reusable React components
│   ├── AboutModal.tsx
│   ├── AudioSourceSelector.tsx
│   ├── ControlBar.tsx
│   ├── HelpModal.tsx
│   ├── icons.tsx
│   └── TranscriptionDisplay.tsx
├── hooks/              # Custom React hooks
│   └── useTranscription.ts
├── public/             # Static assets
├── src/                # Source files
│   ├── App.tsx         # Main application component
│   ├── index.tsx       # Entry point
│   └── types.ts        # TypeScript type definitions
├── .env.example        # Example environment file
├── index.html          # Main HTML file
└── ...                 # Other config files
```

---

## Author

- **Kevin Keihani**
- **Company:** Soroush Fanavari Co
- **Contact:** `yz.keihani@gmail.com`
- **GitHub:** [@keihani](https://github.com/keihani)
- **LinkedIn:** [in/keihani](https://linkedin.com/in/keihani)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
