import { Send } from '@mui/icons-material';
import { Box, Button, Paper, TextField, CircularProgress } from '@mui/material';
import React, { useState } from 'react'

const UserInput = ({ inputValue, setMessages, setInputValue, setQuery }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        console.log("🚀 ~ handleSubmit ~ Function called!");
        e.preventDefault();
        if (inputValue.trim() === '' || isLoading) {
            console.log("🚫 ~ handleSubmit ~ Early return - empty input or loading");
            return;
        }

        console.log("📝 ~ handleSubmit ~ Input value:", inputValue);
        setIsLoading(true);

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        try {
            // Send user message to /compile-sql
            const response = await fetch(`/compile-sql?question=${encodeURIComponent(inputValue)}`, { method: 'POST' });
            console.log("📡 ~ handleSubmit ~ Response received:", response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("🚀 ~ handleSubmit ~ data:", data)

            // Set the SQL query from API response
            setQuery(data.sql);

            // First bot message with reason
            const reasonMessage = {
                id: Date.now() + 1,
                text: `Reason:\n${data.reason}`,
                sender: 'bot',
                timestamp: new Date()
            };
            // Second bot message with SQL query
            const sqlMessage = {
                id: Date.now() + 2,
                text: `SQL Query:\n${data.sql}`,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, reasonMessage, sqlMessage]);
            // setIsLoading(false);
        } catch (error) {
            console.error('❌ ~ handleSubmit ~ Error calling API:', error);
            setQuery(inputValue); // fallback to original input
            const botMessage = {
                id: Date.now() + 1,
                text: 'Sorry, I encountered an error processing your request.\nMake sure you are not using any prohibited commands like deletion or insertion',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        }
        setIsLoading(false);
        setInputValue('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={isLoading ? "Waiting for response..." : "Type your message..."}
                    value={isLoading ? "Looking in to the database" : inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    multiline
                    maxRows={3}
                    disabled={isLoading}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3
                        }
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                    disabled={!inputValue.trim() || isLoading}
                    sx={{
                        minWidth: 'auto',
                        px: 3,
                        borderRadius: 3,
                        backgroundColor: "#43A5BE"
                    }}
                >
                    {isLoading ? "..." : "Send"}
                </Button>
            </Box>
        </Paper>
    )
}

export default UserInput;