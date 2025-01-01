import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Chip, Box, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';

// Styled components for a cleaner UI
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CardWrapper = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  borderRadius: 16,
  boxShadow: theme.shadows[3],
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: theme.shadows[6],
  },
}));

const CardHeaderStyled = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between', // Aligns title and button on opposite sides
  alignItems: 'center',
}));

const RecipeTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.25rem',
  color: theme.palette.text.primary,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const TagWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

const TagChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
  fontSize: '0.875rem',
  borderRadius: '16px',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1rem',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const RecipeSourceLink = styled('a')(({ theme }) => ({
  display: 'block',
  marginTop: theme.spacing(2),
  color: theme.palette.primary.main,
  fontSize: '0.875rem',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const SingleCard = ({ recipe, deleteRecipe }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const fallbackImage = "/custom_plate.png";

  return (
    <CardWrapper>
      {/* Recipe Image */}
      <CardMedia
        component="img"
        height="200"
        image={recipe?.image || fallbackImage}
        alt={recipe?.name || "Recipe Image"}
        style={{
          objectFit: 'cover',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      />
      
      {/* Recipe Header with Title and Delete Button */}
<CardHeaderStyled
  title={
    <RecipeTitle
      variant="h6"
      component="a"
      href={recipe?.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
    >
      {recipe?.name || "Untitled Recipe"}
    </RecipeTitle>
  }
  action={
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {/* Source Button */}
      <IconButton
        href={recipe?.source || "#"} // Fallback URL if no source is provided
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        aria-label="view source"
      >
        <LinkIcon />
      </IconButton>
      {/* Delete Button */}
      <IconButton
        onClick={() => deleteRecipe(recipe?.id)} // Defensive check for id
        color="error"
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  }
/>

      {/* Tags */}
      <CardContent>
        <SectionTitle variant="h6">Tags:</SectionTitle>
        <TagWrapper>
          {recipe?.tags?.map((tag, index) => (
            <TagChip key={index} label={tag} size="small" />
          ))}
        </TagWrapper>
      </CardContent>

      {/* Expand Button */}
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      {/* Expandable Instructions Section */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* Ingredients Section */}
          <SectionTitle variant="h6">Ingredients:</SectionTitle>
          <Typography variant="body2" color="text.secondary" paragraph>
            {recipe?.ingredients || "No ingredients provided"}
          </Typography>
          <SectionTitle variant="h6">Instructions:</SectionTitle>
          <Typography variant="body2" color="text.secondary" paragraph>
            {recipe?.instructions || "No instructions provided"}
          </Typography>
        </CardContent>
      </Collapse>

    </CardWrapper>
  );
}

export default SingleCard;
