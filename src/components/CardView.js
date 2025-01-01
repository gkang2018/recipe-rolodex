import React, { useState } from "react";
import SingleCard from "./SingleCard";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import { Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore instance
import RecipesData from "../data.json"; // Assuming this is the path to your data.json

// Styled Button for Random Recipe Picker
const RandomRecipeButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#FF4500",
  color: "white",
  borderRadius: "50px",
  padding: "10px 20px",
  fontWeight: "bold",
  textTransform: "none",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#FF4500",
  },
  "&:focus": {
    outline: "none",
  },
}));

// Styled Box to group search bar and button
const SearchContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(4),
}));

// Style the search bar for consistent height with the button
const StyledSearchBar = styled(TextField)(({ theme }) => ({
  flex: 1, // Take up available space
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px",
    backgroundColor: theme.palette.background.paper,
  },
}));

// Dialog Content Styling
const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: "#f9f9f9",
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  display: "flex",
  justifyContent: "center",  // Centers the content horizontally
  alignItems: "center",  // Centers the content vertically
  height: "100%",  // Ensures the content takes full height of the dialog
}));

const TitleWrapper = styled(Box)(({ theme }) => ({
    textAlign: "center",
    marginBottom: theme.spacing(3),
    fontFamily: "'Roboto', sans-serif",  // Use modern font family
    letterSpacing: "1px",  // Adds spacing between letters for a modern feel
    color: theme.palette.primary.main,  // Use primary color for text
  }));
  
  const ModernTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 500,  // Reduced weight for a less bold appearance
    fontSize: "2rem",  // Larger font size
    lineHeight: "1.4",  // Slightly adjusted line height for balance
    textTransform: "uppercase",  // Make the text uppercase for a modern effect
    letterSpacing: "2px",  // Wider letter spacing for a modern look
    textShadow: "1px 1px 4px rgba(0, 0, 0, 0.1)",  // Softer shadow for depth
    backgroundImage: "linear-gradient(45deg, #FF6347, #FF4500)", // Gradient effect
    WebkitBackgroundClip: "text",  // Ensure background gradient is clipped to text
    color: "transparent",  // Ensure text color is transparent to show gradient
    transition: "transform 0.3s ease, color 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",  // Slight zoom effect on hover
      color: theme.palette.text.primary,  // Change color on hover
    },
  }));
  
  const CardView = ({ recipes, deleteRecipe }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [randomRecipe, setRandomRecipe] = useState(null);  // To store the randomly selected recipe
    const [isDialogOpen, setIsDialogOpen] = useState(false);  // Modal open/close state
    
    // Handle search input
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };
    
    // Filter recipes based on search term
    const filteredRecipes = recipes.filter((recipe) => {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      return (
        recipe.name.toLowerCase().includes(lowercasedSearchTerm) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(lowercasedSearchTerm))
      );
    });
  
    // Select a random recipe and open the modal
    const handleRandomRecipe = () => {
      const randomIndex = Math.floor(Math.random() * recipes.length);
      const selectedRecipe = recipes[randomIndex];
      setRandomRecipe(selectedRecipe);
      setIsDialogOpen(true);  // Open modal
    };
  
    // Close the modal
    const handleCloseDialog = () => {
      setIsDialogOpen(false);
    };
  
    return (
      <Container sx={{ py: 8 }} maxWidth="md">
        {/* Search Bar and Random Recipe Button */}
        <SearchContainer>
          <StyledSearchBar
            fullWidth
            label="Search Recipes"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name or tag"
          />
          <RandomRecipeButton onClick={handleRandomRecipe}>
            Random Recipe
          </RandomRecipeButton>
        </SearchContainer>
  
        {/* Display filtered recipes in Grid */}
        <Grid container spacing={4}>
          {filteredRecipes.length === 0 ? (
            <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
              No recipes found!
            </Typography>
          ) : (
            filteredRecipes.map((recipe) => (
              <Grid item key={recipe.id} xs={12} sm={6} md={4}>
                <SingleCard recipe={recipe} deleteRecipe={deleteRecipe} />
              </Grid>
            ))
          )}
        </Grid>
  
        {/* Dialog for displaying Random Recipe */}
        <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>
            <TitleWrapper>
              <ModernTitle variant="h5" align="center">
                Here's your random recipe of the day
              </ModernTitle>
            </TitleWrapper>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseDialog}
              aria-label="close"
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <StyledDialogContent>
            {randomRecipe ? (
              <SingleCard recipe={randomRecipe} deleteRecipe={deleteRecipe} />
            ) : (
              <Typography variant="body2">No recipe selected.</Typography>
            )}
          </StyledDialogContent>
        </Dialog>
      </Container>
    );
  };
  
  export default CardView;