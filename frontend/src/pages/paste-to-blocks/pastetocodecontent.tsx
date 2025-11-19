import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosClient";
import confetti from "canvas-confetti";
import Header from "../../components/header";
import "../../styles/pages/paste-to-block/PasteToBlocks.css";
import { useUser } from "../../context/UserContext";

type Snippet = {
  code: string;
  type: string;
  explanation: string;
  tags: string[];
  language: string;
};

const PretrainDatabase: React.FC = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const parseSnippets = () => {
    if (!input.trim()) {
      setError("Please paste some code first.");
      return;
    }

    try {
      const json = JSON.parse(input);
      if (Array.isArray(json.snippets)) {
        setSnippets(json.snippets);
        setError("");
        return;
      }
    } catch {}

    // fallback to human-readable parsing
    const snippetBlocks = input.split(/\n{2,}/);
    const parsedSnippets: Snippet[] = snippetBlocks.map((block) => {
      const lines = block.split("\n").map((l) => l.trim());
      const snippet: Snippet = { code: "", type: "", explanation: "", tags: [], language: "" };

      lines.forEach((line) => {
        if (line.startsWith("Code:")) snippet.code = line.replace("Code:", "").trim();
        else if (line.startsWith("Type:")) snippet.type = line.replace("Type:", "").trim();
        else if (line.startsWith("Language:")) snippet.language = line.replace("Language:", "").trim();
        else if (line.startsWith("Explanation:")) snippet.explanation = line.replace("Explanation:", "").trim();
        else if (line.startsWith("Tags:")) snippet.tags = line.replace("Tags:", "").split(",").map(t => t.trim());
      });

      return snippet;
    });

    setSnippets(parsedSnippets);
    setError("");
  };

  const saveSnippetsToDatabase = async () => {
    if (!user) {
      setError("You must be logged in to save snippets.");
      return;
    }
    if (!snippets.length) {
      setError("No snippets to save. Generate snippets first.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/preload-snippets`,
        { snippets },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSavedCount(response.data.count);
        setShowSuccess(true);
        setSnippets([]);
        setInput("");

        // 🎉 Confetti effect
        const duration = 3000;
        const end = Date.now() + duration;
        (function frame() {
          confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
          confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.details || "Failed to save snippets: network or server error.");
    }
  };

  const handleSnippetChange = (index: number, field: "explanation" | "tags", value: string) => {
    const updated = [...snippets];
    if (field === "tags") updated[index][field] = value.split(",").map((t) => t.trim());
    else updated[index][field] = value;
    setSnippets(updated);
  };

  const closeSuccessModal = () => setShowSuccess(false);

  return (
    <div className="pretrain-container" style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      <Header />

      {/* Left */}
      <div style={{ flex: 1 }}>
        <h2>Paste Snippets</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your code snippets here..."
          rows={20}
          style={{ width: "100%", padding: "1rem", fontFamily: "monospace", fontSize: "0.9rem" }}
        />
        <div style={{ marginTop: "1rem" }}>
          <button onClick={parseSnippets} style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}>Parse Snippets</button>
          <button onClick={saveSnippetsToDatabase} style={{ padding: "0.5rem 1rem" }}>Save to Database</button>
        </div>
        {error && <p style={{ marginTop: "1rem", color: "red" }}>{error}</p>}
      </div>

      {/* Right */}
      <div style={{ flex: 1 }}>
        <h2>Preview & Edit Snippets</h2>
        <div style={{ background: "#f7f7f7", padding: "1rem", borderRadius: "0.5rem", maxHeight: "80vh", overflowY: "auto" }}>
          {snippets.map((s, i) => (
            <div key={i} style={{ marginBottom: "1rem", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.3rem" }}>
              <p style={{ fontFamily: "monospace", margin: "0 0 0.5rem 0" }}><strong>Code:</strong> {s.code}</p>
              <p style={{ margin: "0 0 0.3rem 0" }}><strong>Type:</strong> {s.type}</p>
              <p style={{ margin: "0 0 0.3rem 0" }}><strong>Language:</strong> {s.language}</p>
              <div style={{ marginBottom: "0.3rem" }}>
                <label><strong>Explanation:</strong></label>
                <input type="text" value={s.explanation} onChange={(e) => handleSnippetChange(i, "explanation", e.target.value)} style={{ width: "100%", padding: "0.25rem" }} />
              </div>
              <div>
                <label><strong>Tags (comma-separated):</strong></label>
                <input type="text" value={s.tags.join(", ")} onChange={(e) => handleSnippetChange(i, "tags", e.target.value)} style={{ width: "100%", padding: "0.25rem" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="congrats-overlay" onClick={closeSuccessModal} style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div className="congrats-box" style={{
            background: "#fff", padding: "2rem", borderRadius: "1rem", textAlign: "center"
          }}>
            🎉 Successfully pre-trained database with {savedCount} snippets! 🎉
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Tap anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PretrainDatabase;
