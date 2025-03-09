import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios"; // Make sure axios is installed

import QuestionGenerate from "../components/QuestionForm"; // Import your existing QuestionGenerate form

const QuestionList = () => {
  const [data, setData] = useState([]); // This will hold the table data
  const [showForm, setShowForm] = useState(false); // Toggle form visibility

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/questions/getTrades"); // Adjust URL if needed
        setData(response.data); // Update the state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the function to fetch data
  }, []); // Empty array means it only runs once, when the component mounts

  // Function to handle new data submission and update the table
  const handleAddData = (newData) => {
    setData((prevData) => [...prevData, newData]);
    setShowForm(false); // Close form after data is added
  };

  // Function to handle form cancel action
  const handleCancelForm = () => {
    setShowForm(false); // Hide form if user cancels
  };

  // Helper function to calculate number of questions for each type (MCQ, Objective, Numerical)
  const calculateQuestions = (item, type) => {
    return item.modules
      .flatMap((module) =>
        module.topics.flatMap((topic) =>
          topic.levels.filter((level) => level.type === type)
        )
      )
      .reduce((acc, curr) => acc + curr.numQuestions, 0); // Summing up numQuestions from filtered levels
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        sx={{ float: "right", margin: "20px" }}
        onClick={() => setShowForm(true)}
      >
        Add Question Data
      </Button>

      {/* Show the QuestionGenerate form when showForm is true */}
      {showForm && <QuestionGenerate onSubmit={handleAddData} onCancel={handleCancelForm} />}

      {/* Conditionally render the table only if showForm is false */}
      {!showForm && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Trade Name</TableCell>
                <TableCell>Module Name</TableCell>
                <TableCell>Topic Name</TableCell>
                <TableCell>No. of Questions</TableCell>
                <TableCell>MCQ Questions</TableCell>
                <TableCell>Subjective Questions</TableCell>
                <TableCell>True/False Questions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                <TableCell>{item.tradeType}</TableCell>
                <TableCell>{item.modules.map((module) => module.name).join(", ")}</TableCell>
                <TableCell>{item.modules.flatMap((module) => module.topics.map((topic) => topic.name)).join(", ")}</TableCell>
                <TableCell>
                  {item.modules
                    .flatMap((module) =>
                      module.topics.flatMap((topic) => topic.totalQuestions)
                    )
                    .reduce((acc, curr) => acc + curr, 0)}
                </TableCell>
                <TableCell>
                  {calculateQuestions(item, "MCQ")}
                </TableCell>
                <TableCell>
                  {calculateQuestions(item, "Subjective")}
                </TableCell>
                <TableCell>
                  {calculateQuestions(item, "True/False")}
                </TableCell>
              </TableRow>
              
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default QuestionList;