'use client';

import { useState } from 'react';
import resumeData from '@/data/resume.json';

interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

const RecruiterPanel = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMatch = async () => {
    setLoading(true);
    setError('');
    setMatchResult(null);

    try {
      const response = await fetch('/api/match-jd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription, url: jobUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMatchResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recruiter-panel">
      <h2 className="title">Recruiter Skill Matcher</h2>
      <textarea
        className="textarea"
        rows={6}
        placeholder="Paste Job Description Here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        disabled={loading}
      />
      <div className="or-divider">OR</div>
      <input
        type="text"
        className="input"
        placeholder="Enter Job URL (e.g., LinkedIn, Indeed)"
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
        disabled={loading}
      />
      <button
        className="button"
        onClick={handleMatch}
        disabled={loading || (!jobDescription && !jobUrl)}
      >
        {loading ? 'Analyzing...' : 'Analyze Match'}
      </button>

      {error && <div className="error-message">{error}</div>}

      {matchResult && (
        <div className="match-result">
          <h3>Match Result</h3>
          <div className="score">{matchResult.score}%</div>
          <div className="skill-lists">
            <div className="skill-list">
              <h4>Matched Skills</h4>
              <ul>
                {matchResult.matchedSkills.length > 0 ? (
                  matchResult.matchedSkills.map((skill) => <li key={skill}>{skill}</li>)
                ) : (
                  <li>No matched skills</li>
                )}
              </ul>
            </div>
            <div className="skill-list">
              <h4>Missing Skills</h4>
              <ul>
                {matchResult.missingSkills.length > 0 ? (
                  matchResult.missingSkills.map((skill) => <li key={skill}>{skill}</li>)
                ) : (
                  <li>No missing skills</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .recruiter-panel {
          background-color: #1a1a1a;
          padding: 30px;
          border-radius: 8px;
          text-align: center;
        }
        .title {
          margin-bottom: 20px;
        }
        .textarea,
        .input {
          width: 100%;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #333;
          background-color: #222;
          color: #eee;
          margin-bottom: 15px;
        }
        .or-divider {
          margin: 15px 0;
        }
        .button {
          background-color: #333;
          color: #eee;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .button:hover {
          background-color: #444;
        }
        .button:disabled {
          background-color: #222;
          cursor: not-allowed;
        }
        .error-message {
          color: #ff4d4d;
          margin-top: 20px;
        }
        .match-result {
          margin-top: 30px;
        }
        .score {
          font-size: 48px;
          font-weight: bold;
          color: #4caf50;
          margin-bottom: 20px;
        }
        .skill-lists {
          display: flex;
          justify-content: space-around;
        }
        .skill-list h4 {
          margin-bottom: 10px;
        }
        .skill-list ul {
          list-style: none;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default RecruiterPanel;
