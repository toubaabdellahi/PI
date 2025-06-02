import React from "react";
// import { BlueButton } from "./BlueButton";
// import { Language } from "./Language";
// import { WhiteFilled } from "./WhiteFilled";
// import logo from "./logo.svg";
import "../style.css";

export const Home = () => {
  return (
    <div className="acceuil">
      <div className="div">
        <div className="navbar">
          <div className="content">
            <div className="left-side">
              {/* <img className="logo" alt="Logo" src={logo} /> */}

              <div className="div-2">
                <div className="text-wrapper-2">Acceuil</div>

                <div className="text-wrapper-2">Fonctionnalités</div>

                <div className="text-wrapper-2">À propos</div>

                <div className="text-wrapper-2">Contacts</div>
              </div>
            </div>

            <div className="right-side">
              {/* <Language className="world" color="white" /> */}
              <div className="divider" />

              <div className="div-2">
                <div className="text-wrapper-3">Log In</div>

                {/* <BlueButton
                  className="blue-button-instance"
                  icon={false}
                  size="medium"
                  text="Sign up"
                /> */}
              </div>
            </div>
          </div>
        </div>

        <div className="top-side">
          <div className="text">
            <p className="p">Welcome to the Substance AI</p>

            <p className="text-wrapper-4">
              SubstancIA révolutionne l’apprentissage en ligne en sélectionnant
              les meilleures ressources pour vous, les organisant en parcours
              sur mesure et intégrant des éléments de gamification. Découvrez
              une expérience éducative immersive, efficace, et parfaitement
              adaptée à vos besoins.
            </p>
          </div>

          <div className="buttons">
            {/* <BlueButton
              className="design-component-instance-node"
              icon={false}
              size="big"
              text="Request a demo"
            /> */}
            {/* <WhiteFilled
              className="white-1-filled-button"
              icon
              size="big"
              text="Watch video"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};



export default Home;







































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   CircularProgress,
// } from '@mui/material';

// function PdfManager() {
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [message, setMessage] = useState('');
//   const [pdfs, setPdfs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const userId = localStorage.getItem('userId');

//   // Charger les fichiers existants
//   useEffect(() => {
//     fetchPdfs();
//   }, []);

//   const fetchPdfs = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`http://localhost:8000/api/auth/list-pdfs/${userId}`);
//       setPdfs(response.data.files);
//     } catch (error) {
//       console.error('Erreur lors du chargement des fichiers :', error);
//     }
//     setLoading(false);
//   };

//   const handleFileChange = (e) => {
//     setSelectedFiles(Array.from(e.target.files));
//   };

//   const handleUpload = async () => {
//     if (selectedFiles.length === 0) return;

//     const formData = new FormData();
//     formData.append('user_id', userId);
//     formData.append('message', message); // à gérer côté back si besoin

//     selectedFiles.forEach((file) => {
//       formData.append('file', file); // gérer un seul fichier à la fois côté back
//     });

//     try {
//       const res = await axios.post('http://localhost:8000/api/auth/upload-pdf/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       alert('Fichier(s) envoyé(s) avec succès');
//       setSelectedFiles([]);
//       setMessage('');
//       fetchPdfs(); // Recharger la liste
//     } catch (error) {
//       console.error('Erreur d\'upload :', error);
//       alert("Échec de l'envoi");
//     }
//   };

//   const handleDownload = (fileId) => {
//     window.open(`http://localhost:8000/api/auth/download-pdf/${fileId}`, '_blank');
//   };

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>
//         Gestion des fichiers PDF
//       </Typography>

//       <Box mb={3}>
//         <TextField
//           fullWidth
//           label="Message"
//           variant="outlined"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           multiline
//         />

//         <input
//           type="file"
//           accept="application/pdf"
//           multiple
//           onChange={handleFileChange}
//           style={{ marginTop: 16 }}
//         />

//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleUpload}
//           disabled={selectedFiles.length === 0}
//           sx={{ mt: 2 }}
//         >
//           Envoyer le(s) fichier(s)
//         </Button>
//       </Box>

//       <Typography variant="h5" gutterBottom>
//         Fichiers déjà envoyés :
//       </Typography>

//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <List>
//           {pdfs.map((file) => (
//             <React.Fragment key={file._id}>
//               <ListItem
//                 secondaryAction={
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     onClick={() => handleDownload(file._id)}
//                   >
//                     Télécharger
//                   </Button>
//                 }
//               >
//                 <ListItemText
//                   primary={file.filename}
//                   secondary={`Taille : ${(file.length / 1024).toFixed(2)} Ko`}
//                 />
//               </ListItem>
//               <Divider />
//             </React.Fragment>
//           ))}
//         </List>
//       )}
//     </Box>
//   );
// }

