'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import RecruiterPanel from '@/components/ui/RecruiterPanel';
import resumeData from '@/data/resume.json'; // Import resume data

export default function Home() {
  return (
    <main>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Resume Header Section */}
        <Box sx={{ my: 4, p: 3, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {resumeData.name}
          </Typography>
          <Typography variant="h5" component="h2" color="text.secondary" gutterBottom>
            {resumeData.title}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {resumeData.summary}
          </Typography>
        </Box>

        {/* Skills Section */}
        <Box sx={{ my: 4, p: 3, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Skills
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {resumeData.skills.map((skill) => (
              <Chip
                key={skill.name}
                label={skill.name}
                variant="outlined"
                color="primary"
                sx={{ borderColor: 'primary.light', color: 'primary.light' }}
              />
            ))}
          </Box>
        </Box>

        {/* Projects Section */}
        <Box sx={{ my: 4, p: 3, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Projects
          </Typography>
          <Grid container spacing={2}>
            {resumeData.projects.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} component="div">
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">Skills Used:</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {project.skillsUsed.map((skill, skillIndex) => (
                          <Chip key={skillIndex} label={skill} size="small" variant="filled" color="info" />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recruiter Panel */}
        <Box sx={{ my: 4, zIndex: 1, position: 'relative', backgroundColor: 'rgba(0, 0, 0, 0.5)', p: 2, borderRadius: 1 }}>
          <RecruiterPanel />
        </Box>
      </Container>
    </main>
  );
}
