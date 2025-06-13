import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Divider
} from '@mui/material';

function ListPdfsUI({ userId }) {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les PDF uploadés pour ce user
    axios.get(`http://localhost:8000/api/list-pdfs/${userId}`)
      .then(response => {
        setPdfs(response.data.files);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des fichiers :", error);
        setLoading(false);
      });
  }, [userId]);

  const handleDownload = (fileId) => {
    window.open(`http://localhost:8000/api/download-pdf/${fileId}`, '_blank');
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Liste des fichiers PDF
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {pdfs.map((file) => (
            <React.Fragment key={file._id}>
              <ListItem
                secondaryAction={
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDownload(file._id)}
                  >
                    Télécharger
                  </Button>
                }
              >
                <ListItemText
                  primary={file.filename}
                  secondary={`Taille: ${(file.length / 1024).toFixed(2)} Ko`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}

export default ListPdfsUI;
