'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

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
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Recruiter Skill Matcher
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={6}
        variant="outlined"
        label="Paste Job Description Here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        sx={{ mb: 2 }}
        disabled={loading}
      />
      <Typography variant="body2" sx={{ mb: 1 }}>
        OR
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Enter Job URL (e.g., LinkedIn, Indeed)"
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
        sx={{ mb: 2 }}
        disabled={loading}
      />
      <Button
        variant="contained"
        onClick={handleMatch}
        disabled={loading || (!jobDescription && !jobUrl)}
        startIcon={loading && <CircularProgress size={20} color="inherit" />}
      >
        {loading ? 'Analyzing...' : 'Analyze Match'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {matchResult && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Match Result</Typography>
          <Typography variant="h4" color="primary">{matchResult.score}%</Typography>
          <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
            <Box>
              <Typography variant="subtitle1">Matched Skills</Typography>
              <ul>
                {matchResult.matchedSkills.length > 0 ? (
                  matchResult.matchedSkills.map(skill => <li key={skill}>{skill}</li>)
                ) : (
                  <li>No matched skills</li>
                )}
              </ul>
            </Box>
            <Box>
              <Typography variant="subtitle1">Missing Skills</Typography>
              <ul>
                {matchResult.missingSkills.length > 0 ? (
                  matchResult.missingSkills.map(skill => <li key={skill}>{skill}</li>)
                ) : (
                  <li>No missing skills</li>
                )}
              </ul>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default RecruiterPanel;
