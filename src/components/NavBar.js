import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import RecipeModal from './RecipeModal';

// Styled Button for Add Recipe
const AddRecipeButton = styled(Button)(({ theme }) => ({
  background: 'transparent',
  border: '2px solid white', // White border for better contrast
  color: 'white',
  borderRadius: '50px',
  padding: '8px 16px',
  fontWeight: 'bold',
  textTransform: 'none',
  '&:hover': {
    background: 'white', // Inverts on hover
    color: '#FF4500', // Matches the gradient tones
  },
}));

// Styled AppBar
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF6347, #FF4500)', // More red with subtle orange
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const NavBar = ({ fetchRecipes }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true); // Open the modal when the Add Recipe button is clicked
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between', paddingRight: '24px' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Maansi's Recipe Rolodex
        </Typography>
        <AddRecipeButton
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{ marginRight: '16px' }} // Space from the edge
        >
          Add Recipe
        </AddRecipeButton>
      </Toolbar>
      </StyledAppBar>

      {/* Pass the fetchRecipes function to the RecipeModal */}
      <RecipeModal open={openModal} onClose={handleCloseModal} fetchRecipes={fetchRecipes} />
    </Box>
  );
};

export default NavBar;
