import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
} from "@mui/material";
import { StyledButton } from "../css/StyledComponents";
import { tradeList, moduleList } from "../constants/tradeList";

const initialFormValues = {
  tradeType: "",
  moduleName: "",
  topicName: "",
  noOfQues: "",
  aiModelPurpose: "", // New field for model purpose
  levels: [
    { level: "L1", numQuestions: "", type: "", mcqOptions: "" },
    { level: "L2", numQuestions: "", type: "", mcqOptions: "" },
    { level: "L3", numQuestions: "", type: "", mcqOptions: "" },
  ],
};

export default function QuestionGenerate() {
  const [formValues, setValues] = useState(initialFormValues);
  const [dataFormat, setDataFormat] = useState("Text");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...formValues, [name]: value });
  };

  const handleTableChange = (index, field, value) => {
    const updatedLevels = [...formValues.levels];
    updatedLevels[index][field] = value;
    setValues({ ...formValues, levels: updatedLevels });
  };

  const handleQuestionTypeChange = (index, value) => {
    const updatedLevels = [...formValues.levels];
    updatedLevels[index].type = value;

    if (value !== "MCQ") {
      updatedLevels[index].mcqOptions = "";
    }

    setValues({ ...formValues, levels: updatedLevels });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if levels have valid data
    const levelsValid = formValues.levels.every(level => level.type && (level.type !== "MCQ" || level.mcqOptions));
  
    if (!levelsValid) {
      alert("Please ensure all levels have valid question types and MCQ options (if applicable).");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/questions/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formValues, dataFormat }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Data saved successfully!");
        console.log("Saved Data:", data);
      } else {
        alert("Error saving data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (formValues.moduleName && formValues.topicName) {
      const selectedModule = moduleList.find((module) => module.name === formValues.moduleName);
      const selectedTopic = selectedModule?.topics.find((topic) => topic.name === formValues.topicName);
      
      if (selectedTopic) {
        setValues((prevValues) => ({
          ...prevValues,
          noOfQues: selectedTopic.questions,
          levels: prevValues.levels.map((level) => ({
            ...level,
            numQuestions: selectedTopic.levelwise[level.level] || "",
          })),
        }));
      }
    }
  }, [formValues.moduleName, formValues.topicName]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ padding: 4, borderRadius: 2, backgroundColor: "#F4F4F4" }}>
        <form onSubmit={handleSubmit}>
          {/* General Information */}
          <Box mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Trade</InputLabel>
                  <Select name="tradeType" value={formValues.tradeType} onChange={handleInputChange} label="Trade">
                    {tradeList.map((trade, index) => (
                      <MenuItem key={index} value={trade.name}>{trade.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Module</InputLabel>
                  <Select name="moduleName" value={formValues.moduleName} onChange={handleInputChange} label="Module">
                    {moduleList.map((module, index) => (
                      <MenuItem key={index} value={module.name}>{module.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Topic</InputLabel>
                  <Select name="topicName" value={formValues.topicName} onChange={handleInputChange} label="Topic">
                    {moduleList.find((module) => module.name === formValues.moduleName)?.topics.map((topic, index) => (
                      <MenuItem key={index} value={topic.name}>{topic.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField label="Number of Questions" fullWidth variant="outlined" type="number" value={formValues.noOfQues} disabled />
              </Grid>
            </Grid>
          </Box>

          {/* Data Format */}
          <Box mb={3}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Data Format</FormLabel>
              <RadioGroup row name="dataFormat" value={dataFormat} onChange={(e) => setDataFormat(e.target.value)}>
                <FormControlLabel value="Text" control={<Radio />} label="Text" />
                <FormControlLabel value="Image" control={<Radio />} label="Image" />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* AI Model Purpose (New Field) */}
          <Box mb={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>AI Model Purpose</InputLabel>
              <Select name="aiModelPurpose" value={formValues.aiModelPurpose} onChange={handleInputChange} label="AI Model Purpose">
                <MenuItem value="">Select Model Purpose</MenuItem>
                <MenuItem value="External API">External API</MenuItem>
                <MenuItem value="Internal NIMI Model">Internal NIMI Model</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Question Type and Level */}
          <Box mb={3}>
            <Grid container spacing={2}>
              {formValues.levels.map((level, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <TextField label={`Questions - ${level.level}`} variant="outlined" type="number" value={level.numQuestions} fullWidth disabled />
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Question Type</InputLabel>
                    <Select value={level.type} onChange={(e) => handleQuestionTypeChange(index, e.target.value)} label="Question Type">
                      <MenuItem value="">Select Type</MenuItem>
                      <MenuItem value="MCQ">MCQ</MenuItem>
                      <MenuItem value="Subjective">Subjective</MenuItem>
                      <MenuItem value="True/False">True or False</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Show MCQ Options only if type is MCQ */}
                  {level.type === "MCQ" && (
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel>MCQ Options</InputLabel>
                      <Select value={level.mcqOptions} onChange={(e) => handleTableChange(index, "mcqOptions", e.target.value)} label="MCQ Options">
                        <MenuItem value="">Select Options</MenuItem>
                        {[2, 3, 4, 5, 6].map((option) => (
                          <MenuItem key={option} value={option}>{option} Options</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Submit Button */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <StyledButton variant="contained" size="large" type="submit">Generate Questions</StyledButton>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}