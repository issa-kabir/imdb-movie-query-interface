import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import Headers from './components/headers';
import MessageBody from './components/messageBody';
import UserInput from './components/userInput';
import TableView from './components/TableView';
import { useDuckDB, runQuery } from './hooks/useDuckDB';


function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const { loading } = useDuckDB("/imdb_top_1000.parquet");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadData = async () => {
      if (!loading && query !== '') {
        console.log("lets see")
        try {
          const { tableSchema, tableRows } = await runQuery(query);

          setColumns(tableSchema)
          setTableData([])
          tableRows.forEach((tableRow) => {
            setTableData(prev => [...prev, tableRow.toArray()]);
          });
        } catch (error) {
          setColumns([])
          setTableData([])

          console.error('❌ ~ Error loading table data:', error);
        }
      }
    };

    loadData();
  }, [loading, query]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', p: 2, gap: 1, overflow: 'hidden' }}>
      {/* Left Panel - 30% width */}
      <Box sx={{
        width: '30%',
        display: 'flex',
        flexDirection: 'column',
        minWidth: '300px'
      }}>
        <Headers />
        <MessageBody messages={messages} messagesEndRef={messagesEndRef} loading={loading} />
        <UserInput inputValue={inputValue} setMessages={setMessages} setInputValue={setInputValue} setQuery={setQuery} />
      </Box>

      {/* Right Panel - 70% width */}
      <Box sx={{
        width: '70%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <TableView loading={loading} messages={messages} tableData={tableData} columns={columns} />
      </Box>
    </Box>
  );
}

export default App;
