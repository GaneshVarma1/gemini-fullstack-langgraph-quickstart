# 🔍 Gemini Fullstack LangGraph – Enhanced Fork

> A research-augmented AI assistant using Google Gemini, LangGraph, and FastAPI – now with added features, improved UX, and multimodal support 🚀

## 🧠 What is This?

This is a **fork and upgrade** of [google-gemini/gemini-fullstack-langgraph-quickstart](https://github.com/google-gemini/gemini-fullstack-langgraph-quickstart), originally built to demonstrate how LangGraph agents can do iterative search and synthesis using Gemini models.

My goal is to **extend it into a production-level AI research assistant** with added features, richer prompts, and new use cases like file-based search and developer-oriented tools.

<img src="./app.png" title="Gemini Fullstack LangGraph" alt="Gemini Fullstack LangGraph" width="90%">

## ✨ Enhanced Features

### 🎯 **New UI Features**
- ✅ **Enhanced Welcome Screen** – Tabbed interface with Templates and File Analysis
- ✅ **Prompt Templates** – Pre-configured smart prompts for different research needs
  - Market Research Analysis
  - Technical Deep Dive
  - Data Analysis & Insights
  - Quick Summary
  - Innovation & Future Trends
  - Comparative Analysis
- ✅ **Dark Mode Toggle** – Built-in theme switching
- ✅ **Mode Switcher** – Toggle between Classic and Enhanced interfaces

### 🧩 **Backend Enhancements**
- ✅ **Document Processing Infrastructure** – Support for PDF, DOCX, CSV, images, and text files
- ✅ **Enhanced State Management** – Extended LangGraph state for file processing and sessions
- ✅ **Structured Analysis** – AI-powered document analysis with key insights extraction

### 🔜 **Coming Soon**
- [ ] **Live File Upload** – Frontend integration for document upload
- [ ] **Context-Aware Chat** – Keep memory across multi-turn conversations
- [ ] **Saved Sessions** – Save and restore past chats
- [ ] **Tool Expansion** – YouTube/Reddit/News API search tools
- [ ] **Multimodal Gemini Input** – Image upload and question-answering
- [ ] **Visual Flow UI** – Real-time LangGraph process visualization
- [ ] **LangSmith Tracing** – Full observability for development and debugging

---

## 🔍 How It Works (Enhanced Flow)

1. **User selects a prompt template or enters custom query**
2. **Optional: Upload documents for context-aware analysis**
3. **Gemini processes documents and generates search keywords**
4. **Google Search tool fetches relevant links**
5. **Gemini reflects on results, incorporating document insights**
6. **Agent loops back if needed for additional research**
7. **Final synthesis combines web research with document analysis**

---

## 🧪 Try It Locally

```bash
# Backend
cd backend
pip install -e .
cp .env.example .env  # Add your GEMINI_API_KEY here

# Frontend  
cd ../frontend
npm install --force  # Force install to resolve version conflicts
npm run dev  # Runs on http://localhost:5173

# Backend (separate terminal)
cd backend
langgraph dev  # Runs on http://localhost:2024
```

## 📋 Original Features

- 💬 Fullstack application with a React frontend and LangGraph backend.
- 🧠 Powered by a LangGraph agent for advanced research and conversational AI.
- 🔍 Dynamic search query generation using Google Gemini models.
- 🌐 Integrated web research via Google Search API.
- 🤔 Reflective reasoning to identify knowledge gaps and refine searches.
- 📄 Generates answers with citations from gathered sources.
- 🔄 Hot-reloading for both frontend and backend during development.

## Project Structure

The project is divided into two main directories:

-   `frontend/`: Contains the React application built with Vite.
-   `backend/`: Contains the LangGraph/FastAPI application, including the research agent logic.

## Getting Started: Development and Local Testing

Follow these steps to get the application running locally for development and testing.

**1. Prerequisites:**

-   Node.js and npm (or yarn/pnpm)
-   Python 3.11+
-   **`GEMINI_API_KEY`**: The backend agent requires a Google Gemini API key.
    1.  Navigate to the `backend/` directory.
    2.  Create a file named `.env` by copying the `backend/.env.example` file.
    3.  Open the `.env` file and add your Gemini API key: `GEMINI_API_KEY="YOUR_ACTUAL_API_KEY"`

**2. Install Dependencies:**

**Backend:**

```bash
cd backend
pip install .
```

**Frontend:**

```bash
cd frontend
npm install --force  # Use --force to resolve dependency conflicts
```

**3. Run Development Servers:**

**Backend & Frontend:**

```bash
make dev
```
This will run the backend and frontend development servers.    Open your browser and navigate to the frontend development server URL (e.g., `http://localhost:5173/app`).

_Alternatively, you can run the backend and frontend development servers separately. For the backend, open a terminal in the `backend/` directory and run `langgraph dev`. The backend API will be available at `http://127.0.0.1:2024`. It will also open a browser window to the LangGraph UI. For the frontend, open a terminal in the `frontend/` directory and run `npm run dev`. The frontend will be available at `http://localhost:5173`._

## How the Backend Agent Works (High-Level)

The core of the backend is a LangGraph agent defined in `backend/src/agent/graph.py`. It follows these steps:

<img src="./agent.png" title="Agent Flow" alt="Agent Flow" width="50%">

1.  **Generate Initial Queries:** Based on your input, it generates a set of initial search queries using a Gemini model.
2.  **Document Processing (New):** If files are uploaded, processes them to extract insights and context.
3.  **Web Research:** For each query, it uses the Gemini model with the Google Search API to find relevant web pages.
4.  **Reflection & Knowledge Gap Analysis:** The agent analyzes the search results to determine if the information is sufficient or if there are knowledge gaps. It uses a Gemini model for this reflection process.
5.  **Iterative Refinement:** If gaps are found or the information is insufficient, it generates follow-up queries and repeats the web research and reflection steps (up to a configured maximum number of loops).
6.  **Finalize Answer:** Once the research is deemed sufficient, the agent synthesizes the gathered information into a coherent answer, including citations from the web sources, using a Gemini model.

## CLI Example

For quick one-off questions you can execute the agent from the command line. The
script `backend/examples/cli_research.py` runs the LangGraph agent and prints the
final answer:

```bash
cd backend
python examples/cli_research.py "What are the latest trends in renewable energy?"
```

## 🎨 Enhanced UI Features

### Prompt Templates
The enhanced interface includes six pre-configured templates:

- **Market Research Analysis** (High Effort) - Comprehensive market analysis with data points
- **Technical Deep Dive** (Medium Effort) - Detailed technical explanations with examples  
- **Data Analysis & Insights** (High Effort) - Statistical analysis and actionable recommendations
- **Quick Summary** (Low Effort) - Concise overviews of any topic
- **Innovation & Future Trends** (High Effort) - Cutting-edge developments and predictions
- **Comparative Analysis** (Medium Effort) - Side-by-side comparisons with pros/cons

### Document Processing
Upload and analyze various file types:
- **PDF Documents** - Extract and analyze text content
- **Word Documents** - Process DOCX files
- **CSV Data** - Statistical analysis and insights
- **Images** - Metadata extraction (OCR coming soon)
- **Text Files** - Direct content analysis

## Deployment

In production, the backend server serves the optimized static frontend build. LangGraph requires a Redis instance and a Postgres database. Redis is used as a pub-sub broker to enable streaming real time output from background runs. Postgres is used to store assistants, threads, runs, persist thread state and long term memory, and to manage the state of the background task queue with 'exactly once' semantics. For more details on how to deploy the backend server, take a look at the [LangGraph Documentation](https://langchain-ai.github.io/langgraph/concepts/deployment_options/). Below is an example of how to build a Docker image that includes the optimized frontend build and the backend server and run it via `docker-compose`.

_Note: For the docker-compose.yml example you need a LangSmith API key, you can get one from [LangSmith](https://smith.langchain.com/settings)._

_Note: If you are not running the docker-compose.yml example or exposing the backend server to the public internet, you should update the `apiUrl` in the `frontend/src/App.tsx` file to your host. Currently the `apiUrl` is set to `http://localhost:8123` for docker-compose or `http://localhost:2024` for development._

**1. Build the Docker Image:**

   Run the following command from the **project root directory**:
   ```bash
   docker build -t gemini-fullstack-langgraph -f Dockerfile .
   ```
**2. Run the Production Server:**

   ```bash
   GEMINI_API_KEY=<your_gemini_api_key> LANGSMITH_API_KEY=<your_langsmith_api_key> docker-compose up
   ```

Open your browser and navigate to `http://localhost:8123/app/` to see the application. The API will be available at `http://localhost:8123`.

## Technologies Used

- [React](https://reactjs.org/) (with [Vite](https://vitejs.dev/)) - For the frontend user interface.
- [Tailwind CSS](https://tailwindcss.com/) - For styling.
- [Shadcn UI](https://ui.shadcn.com/) - For components.
- [LangGraph](https://github.com/langchain-ai/langgraph) - For building the backend research agent.
- [Google Gemini](https://ai.google.dev/models/gemini) - LLM for query generation, reflection, and answer synthesis.
- **Enhanced Dependencies:**
  - [Lucide React](https://lucide.dev/) - Modern icon library
  - [PyPDF2](https://pypdf2.readthedocs.io/) - PDF processing
  - [python-docx](https://python-docx.readthedocs.io/) - Word document processing
  - [Pandas](https://pandas.pydata.org/) - Data analysis for CSV files
  - [Pillow](https://pillow.readthedocs.io/) - Image processing

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details. 
