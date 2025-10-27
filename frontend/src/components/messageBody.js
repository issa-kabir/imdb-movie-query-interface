import React from 'react'
import { Person, SmartToy } from '@mui/icons-material';
import { Avatar, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';

const MessageBody = ({ messages, messagesEndRef, loading }) => {

  if (loading) {
    return (
      <Paper elevation={2} sx={{ mb: 1, p: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography>Connecting database...</Typography>
        </Box>
      </Paper>)
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: 'auto',
        p: 1,
        borderRadius: 2,
        mb: 1,
        backgroundImage: 'url(/chat-background.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        ...(messages.length === 0 && {
          display: "flex",
          justifyContent: "center",
          alignItems: 'center'
        }),
      }}
    >

      {messages.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
          Start a conversation by typing a message below...
        </Typography>
      ) : (
        <Stack spacing={1}>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: 1
              }}
            >
              {message.sender === 'bot' && (
                <Avatar sx={{ bgcolor: '#CBD6E2', color: "#253342", width: 42, height: 42 }}>
                  <SmartToy fontSize="medium" />
                </Avatar>
              )}

              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  maxWidth: '70%',
                  borderRadius: 3,
                  color: 'text.primary',
                  backgroundColor: message.sender === 'user' ? '#43A5BE' : '#CAE7D3'
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {message.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    opacity: 0.7,
                    fontSize: '0.75rem'
                  }}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Paper>

              {message.sender === 'user' && (
                <Avatar sx={{ bgcolor: '#5C62D6', width: 42, height: 42 }}>
                  <Person fontSize="medium" />
                </Avatar>
              )}
            </Box>
          ))}
        </Stack>
      )}
      <div ref={messagesEndRef} />
    </Box>
  )
}

export default MessageBody;