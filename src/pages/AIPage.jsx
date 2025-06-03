import React, { useState } from 'react';
import OpenAI from 'openai';
import Layout from "../pages/Layout";
import "../styles/AIPageStyle.css";

const SparkleIcon = () => (
  <svg width="30" height="30" fill="none" style={{ marginBottom: -5 }}>
    <g>
      <path d="M15 2v5M15 23v5M5 15H0M30 15h-5M22.07 7.93l-3.54 3.54M11.47 18.53l-3.54 3.54M22.07 22.07l-3.54-3.54M11.47 11.47l-3.54-3.54"
        stroke="#FA812F" strokeWidth="2" strokeLinecap="round" />
      <circle cx="15" cy="15" r="6" fill="#FFB22C" />
    </g>
  </svg>
);

export default function AI() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const openai = new OpenAI({
        apikey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true, // ⚠️ ONLY for testing
      });

      const result = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: `Give me an outline in 5 lines to complete this task, ${input} `
        }],
      });

      const message = result.choices[0]?.message?.content;
      setResponse(message || "No response.");
    } catch (err) {
      setResponse("Error getting response.");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="ai-outer">
        <div className="ai-card">
          <div className="ai-title-row">
            <h2 className="ai-title">
              Smart Task Ideas <span role="img" aria-label="Robot">🤖</span>
            </h2>
            <SparkleIcon />
          </div>
          <div className="ai-subtitle">
            Ask for help, outlines, or tips to complete your tasks!
          </div>
          <textarea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your task or question here…"
            className="ai-textarea"
            disabled={loading}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="ai-btn"
            onMouseOver={e => { if (!loading) e.target.style.background = "linear-gradient(90deg, #582F0E 0%, #582F0E 80%, #582F0E 100%)"; }}
            onMouseOut={e => { if (!loading) e.target.style.background = "linear-gradient(90deg, #7F4F24 0%, #7F4F24 80%, #7F4F24 100%)"; }}
          >
            {loading ? 'Loading...' : 'Get Outline'}
          </button>
          {response && (
            <div className="ai-response">
              <div className="ai-response-title">
                <span role="img" aria-label="bulb">💡</span> AI Suggestion:
              </div>
              <div>{response}</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}