# Open-source AI REST gateway

Gemini has been removed. All AI calls go through an OpenAI-compatible REST gateway configured with `AI_API_BASE_URL`. This works with vLLM, Ollama (OpenAI compatibility), llama.cpp server, LocalAI, or a self-hosted gateway exposing `/chat/completions`.

The application keeps deterministic Czech FAQ responses as a local fallback. Image, video, transcription, and music routes delegate to gateway-specific REST endpoints; configure or proxy those endpoints in your gateway.

Recommended local setup:

```bash
# vLLM example
vllm serve Qwen/Qwen2.5-7B-Instruct --api-key local

cp .env.example .env.local
bun install
bun run dev
```

Set `AI_API_KEY` only if the gateway requires it. No Google/Gemini credential is needed.
