import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const FileInputWithPrompt = ({ onSend, onFileUpload }) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
      // Réinitialiser l'input fichier pour permettre la sélection du même fichier
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Container>
      <FormContainer onSubmit={handleSubmit} $isFocused={isFocused}>
        <TextInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Posez votre question..."
          aria-label="Message input"
        />
        <HiddenFileInput
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept=".pdf,.doc,.docx,.txt,.pptx,.ppt,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
        />
        <ButtonGroup>
          <AttachButton type="button" onClick={triggerFileInput} aria-label="Attach file">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 15V8C18 4.69 15.31 2 12 2C8.69 2 6 4.69 6 8V16C6 19.31 8.69 22 12 22C15.31 22 18 19.31 18 16V10H16V16C16 18.21 14.21 20 12 20C9.79 20 8 18.21 8 16V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V15H18Z" fill="currentColor" />
            </svg>
          </AttachButton>
          <SendButton type="submit" disabled={!inputValue.trim()} aria-label="Send message">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.4 20.4L20.85 12.92C21.66 12.57 21.66 11.43 20.85 11.08L3.4 3.6C2.74 3.31 2.01 3.8 2.01 4.51L2 9.12C2 9.62 2.37 10.05 2.87 10.11L17 12L2.87 13.88C2.37 13.95 2 14.38 2 14.88L2.01 19.49C2.01 20.2 2.74 20.69 3.4 20.4Z" fill="currentColor" />
            </svg>
          </SendButton>
        </ButtonGroup>
      </FormContainer>
      <FileTypesHint>Supporte: PDF, DOC, PPT, XLS, TXT, JPG, PNG</FileTypesHint>
    </Container>
  );
};

// Styles avec styled-components
const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
`;

const FormContainer = styled.form`
  display: flex;
  align-items: center;
  border-radius: 24px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.inputBackground || '#f7f7f8'};
  border: 1px solid ${({ $isFocused, theme }) =>
    $isFocused ? (theme.inputFocusBorder || '#10a37f') : (theme.inputBorder || 'rgba(0, 0, 0, 0.1)')};
  box-shadow: ${({ $isFocused }) => $isFocused ? '0 0 0 2px rgba(16, 163, 127, 0.1)' : 'none'};
  transition: all 0.2s ease;
`;

const TextInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px;
  font-size: 16px;
  outline: none;
  color: ${({ theme }) => theme.inputText || '#333'};

  &::placeholder {
    color: ${({ theme }) => theme.inputPlaceholder || '#999'};
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.buttonIcon || '#666'};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover || 'rgba(0, 0, 0, 0.05)'};
    color: ${({ theme }) => theme.buttonIconHover || '#10a37f'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AttachButton = styled(Button)`
  position: relative;
`;

const SendButton = styled(Button)`
  color: ${({ theme, disabled }) =>
    disabled ? (theme.buttonIconDisabled || '#999') : (theme.sendButtonIcon || '#10a37f')};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.sendButtonHover || 'rgba(16, 163, 127, 0.1)'};
    color: ${({ theme }) => theme.sendButtonIconHover || '#0d8e6d'};
  }
`;

const FileTypesHint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.hintText || '#999'};
  margin: 8px 16px 0;
  text-align: center;
`;

export default FileInputWithPrompt;