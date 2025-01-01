import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip'; // For displaying tags
import { db } from "../firebase"; // Import Firestore instance
import { collection, addDoc } from "firebase/firestore";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

export default function RecipeModal({ open, onClose, fetchRecipes }) {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    tags: [], // To store tags
    currentTag: '', // Current tag input value
    source: '', // New field for recipe source
  });

  const [loading, setLoading] = useState(false);  // Track loading state
  const [error, setError] = useState(null);       // Track error state

  // Handle input changes for recipe fields (name, ingredients, instructions, source)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  // Handle adding a tag when the user presses Enter
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && recipe.currentTag.trim() !== '') {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        tags: [...prevRecipe.tags, recipe.currentTag.trim()],
        currentTag: '', // Clear the input field after adding the tag
      }));
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      tags: prevRecipe.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle form submission to save the recipe to Firestore
  const handleSubmit = async () => {
    setLoading(true);  // Start the loading state
    setError(null);    // Clear any previous errors
    try {
      // Add recipe data to the 'recipes' collection
      await addDoc(collection(db, 'recipes'), {
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        tags: recipe.tags,
        source: recipe.source, // Save the source link to Firestore
      });
      console.log('New Recipe Submitted:', recipe);
      // Reset the form fields after successful submission
      setRecipe({
        name: '',
        ingredients: '',
        instructions: '',
        tags: [],
        currentTag: '',
        source: '',
      });
      fetchRecipes(); // Refresh the recipe list in the parent component
      onClose(); // Close the modal after submitting
    } catch (error) {
      console.error('Error adding document: ', error);
      setError('Failed to add recipe. Please try again later.');
    } finally {
      setLoading(false); // Stop the loading state
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a New Recipe</DialogTitle>
      <DialogContent>
        {/* Recipe Name */}
        <TextField
          autoFocus
          margin="dense"
          label="Recipe Name"
          type="text"
          fullWidth
          variant="outlined"
          name="name"
          value={recipe.name}
          onChange={handleChange}
        />

        {/* Ingredients */}
        <TextField
          margin="dense"
          label="Ingredients"
          type="text"
          fullWidth
          variant="outlined"
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          multiline
          rows={4}
        />

        {/* Instructions */}
        <TextField
          margin="dense"
          label="Instructions"
          type="text"
          fullWidth
          variant="outlined"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          multiline
          rows={4}
        />

        {/* Recipe Source */}
        <TextField
          margin="dense"
          label="Source Link"
          type="url"
          fullWidth
          variant="outlined"
          name="source"
          value={recipe.source}
          onChange={handleChange}
          placeholder="https://example.com"
        />

        {/* Tags Section */}
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Tags"
            variant="outlined"
            fullWidth
            value={recipe.currentTag}
            onChange={handleChange}
            name="currentTag"
            onKeyDown={handleAddTag}
            placeholder="Press Enter to add a tag"
          />
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap' }}>
            {recipe.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Box>

        {/* Show Progress Bar or Error Message */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
