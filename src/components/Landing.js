import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import CardView from './CardView';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore instance

function Landing() {
  const [recipes, setRecipes] = useState([]); // State to hold recipes

  // Fetch recipes from Firestore
  const fetchRecipes = async () => {
    try {
      const data = await getDocs(collection(db, 'recipes'));
      const fetchedRecipes = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  // Delete a recipe from Firestore
  const deleteRecipe = async (recipeId) => {
    try {
      const recipeDoc = doc(db, 'recipes', recipeId);
      await deleteDoc(recipeDoc);
      console.log('Recipe deleted successfully');
      fetchRecipes(); // Refresh the list of recipes after deletion
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  useEffect(() => {
    fetchRecipes(); // Fetch recipes when component mounts
  }, []);

  return (
    <div>
      {/* Pass fetchRecipes and deleteRecipe to NavBar and CardView */}
      <NavBar fetchRecipes={fetchRecipes} />
      <CardView recipes={recipes} deleteRecipe={deleteRecipe} />
    </div>
  );
}

export default Landing;
