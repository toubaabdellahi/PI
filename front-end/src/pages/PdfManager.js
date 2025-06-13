import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  TextField,
  IconButton,
  CircularProgress,
  InputAdornment,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Typography,
  styled,
  CssBaseline,
  AppBar,
  Toolbar,
  Chip,
} from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  Menu as MenuIcon,
  History as HistoryIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const NewChatButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  padding: "12px 24px",
  margin: "16px",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  fontWeight: 500,
  fontSize: "0.875rem",
  textTransform: "none",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  },
  "& .MuiButton-startIcon": {
    marginRight: "8px",
  },
}));

function PdfManager() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.user_id;
  const userName = localStorage.getItem("userName");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    setShowWelcome(false);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 && !message.trim()) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });
    formData.append("user_id", userId);
    formData.append("message", message);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/auth/upload-pdf/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newChatItem = {
        id: response.data.file_ids[0], // Utilise l'ObjectId retourné par le backend
        text: message,
        files: selectedFiles.map((f) => f.name),
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      };
      setChatHistory((prev) => [newChatItem, ...prev]);
      setShowWelcome(false);
      setSelectedFiles([]);
      setMessage("");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Échec de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpload();
  };

  const triggerFileInput = () => {
    document.getElementById("file-input").click();
  };

  const startNewChat = () => {
    setMessage("");
    setSelectedFiles([]);
    setShowWelcome(true);
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      // Validation de l'ID
      if (!fileId || !/^[0-9a-f]{24}$/i.test(fileId)) {
        throw new Error(`ID ${fileId} invalide - Format MongoDB requis (24 caractères hexadécimaux)`);
      }

      const response = await axios.get(
        `http://localhost:8000/api/auth/download_pdf/${fileId}/`,
        {
          responseType: "blob",
          timeout: 10000,
        }
      );

      // Extraction du nom de fichier
      const contentDisposition = response.headers["content-disposition"];
      const finalFileName = fileName ||
        (contentDisposition
          ? contentDisposition.split("filename=")[1].replace(/"/g, "")
          : `document_${fileId.slice(-6)}.pdf`);

      // Création du lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();

      // Nettoyage
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Erreur de téléchargement:", {
        id: fileId,
        error: error.response?.data || error.message,
      });
      alert(error.response?.data?.message || "Échec du téléchargement");
    }
  };

  const groupedHistory = chatHistory.reduce((acc, chat) => {
    const date = chat.date || "Autres";
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(chat);
    return acc;
  }, {});

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f7fa" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#ffffff",
          color: "#000000",
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{ mr: 2, color: "#000000" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Substance IA
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            {userName}
          </Typography>
          <IconButton color="inherit" onClick={logout} sx={{ color: "#000000" }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
            marginTop: "64px",
            bgcolor: "#ffffff",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <NewChatButton
            fullWidth
            startIcon={<AddIcon />}
            onClick={startNewChat}
          >
            New Chat
          </NewChatButton>

          <Divider sx={{ my: 1 }} />

          <List>
            <ListItem>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                <HistoryIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                History
              </Typography>
            </ListItem>

            {Object.entries(groupedHistory).map(([date, chats]) => (
              <React.Fragment key={date}>
                <Typography
                  variant="caption"
                  sx={{ px: 2, display: "block", color: "text.secondary" }}
                >
                  {date}
                </Typography>
                {chats.map((chat) => (
                  <React.Fragment key={chat.id}>
                    <ListItem
                      button
                      onClick={() => {
                        setMessage(chat.text);
                        setShowWelcome(false);
                      }}
                      sx={{ py: 1 }}
                    >
                      <ListItemText
                        primary={chat.text || "(No text)"}
                        secondary={
                          <>
                            {chat.files.length > 0 && (
                              <Box component="span">
                                Files:{" "}
                                {chat.files.map((file) => (
                                  <span
                                    key={file}
                                    style={{
                                      color: "#1976d2",
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                      marginRight: "8px",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownload(chat.id, file);
                                    }}
                                  >
                                    {file}
                                  </span>
                                ))}
                              </Box>
                            )}
                            {chat.files.length > 0 && <br />}
                            {chat.timestamp}
                          </>
                        }
                        sx={{
                          "& .MuiListItemText-primary": {
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontSize: "0.875rem",
                          },
                          "& .MuiListItemText-secondary": {
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontSize: "0.75rem",
                          },
                        }}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}

            {chatHistory.length === 0 && (
              <ListItem>
                <ListItemText secondary="No chat history yet" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: "64px",
          marginLeft: sidebarOpen ? "300px" : "0px",
          transition: (theme) =>
            theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 64px)",
        }}
      >
        {showWelcome && chatHistory.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
              Welcome to the Chatbot
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ mb: 4, color: "text.secondary" }}
            >
              Your Personal AI Companion
            </Typography>

            <Typography variant="h6" sx={{ mb: 3 }}>
              Explore various subjects
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
                mb: 6,
                maxWidth: "600px",
              }}
            >
              {[
                "Can you provide an overview of the latest advancements in chatbot intelligence?",
                "What are some effective strategies for improving productivity and time management?",
                "How can I enhance my skills in office management departments?",
              ].map((text) => (
                <Chip
                  key={text}
                  label={text}
                  onClick={() => {
                    setMessage(text);
                    setShowWelcome(false);
                  }}
                  sx={{
                    borderRadius: "16px",
                    p: 1.5,
                    maxWidth: "100%",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                />
              ))}
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "background.paper",
                borderRadius: "12px",
                textAlign: "center",
                maxWidth: "400px",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Upgrade Premium
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                Basic space map version
              </Typography>
              <Button variant="contained" color="primary">
                Upgrade Now
              </Button>
            </Paper>
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflow: "auto", mb: 2 }}>
            {chatHistory.map((chat) => (
              <Paper
                key={chat.id}
                sx={{ p: 2, mb: 2, bgcolor: "background.paper" }}
              >
                <Typography variant="body1">{chat.text}</Typography>
                {chat.files.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Files:{" "}
                      {chat.files.map((file) => (
                        <span
                          key={file}
                          style={{
                            color: "#1976d2",
                            textDecoration: "underline",
                            cursor: "pointer",
                            marginRight: "8px",
                          }}
                          onClick={() => handleDownload(chat.id, file)}
                        >
                          {file}
                        </span>
                      ))}
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        )}

        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: isFocused
              ? "1px solid #10a37f"
              : "1px solid rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease",
            p: 1,
            bgcolor: "background.paper",
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Ask anything or upload files..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (e.target.value) setShowWelcome(false);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            InputProps={{
              disableUnderline: true,
              sx: { px: 2, py: 1 },
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={triggerFileInput}
                    edge="start"
                    aria-label="upload file"
                  >
                    <AttachFileIcon
                      color={selectedFiles.length > 0 ? "primary" : "action"}
                    />
                  </IconButton>
                  <input
                    id="file-input"
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                    hidden
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    disabled={
                      loading || (selectedFiles.length === 0 && !message.trim())
                    }
                    aria-label="send"
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <SendIcon
                        color={
                          selectedFiles.length > 0 || message.trim()
                            ? "primary"
                            : "disabled"
                        }
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 1, px: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Selected files: {selectedFiles.map((f) => f.name).join(", ")}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default PdfManager;