import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import BookIcon from '@mui/icons-material/Book';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { useRouter } from 'next/router'
import { useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';


export default function AddBook({token , closefunc}) {
    

  const [userId, setUserId] = useState(false);

  useEffect(() => {
    // Perform localStorage action
    setUserId( sessionStorage.getItem("user_id"));
  }, [])

  

  const router = useRouter();

  const [isTitleSet, setIsTitleSet] = useState(false);
  const [isAuthorSet, setIsAuthorSet] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const [accessToken, setAccessToken] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setIsInitial(false);
    if  (data.get('title').length > 0){
      setIsTitleSet(true);
    }
    else{
      setIsTitleSet(false);
    }
    if  (data.get('author').length > 0){
      setIsAuthorSet(true);
    }else{
      setIsAuthorSet(false);
    }
   
    if (data.get('title').length > 0 && data.get('author').length > 0 ){
      handleAddBook(data.get('title'),data.get('author'),data.get('published_date'),data.get('isbn'),data.get('cover_image'),data.get('rating'),);

    }

  };

  // Sample book data{
  //   "title": "Harry Potter 1",
  //   "author": "JK Rolling",
  //   "published_date": "2015-10-06",
  //   "isbn": "string",
  //   "cover_image": "https://media.harrypotterfanzone.com/sorcerers-stone-us-childrens-edition-1050x0-c-default.jpg",
  //   "rating": 7,
  //   "id": 1,
  //   "owner_id": 1
  // }

  const handleAddBook = async (title,author,published_date,isbn,cover_image,rating) => {
    const bookData = {
      title: title,
      author: author,
      published_date: published_date,
      isbn: isbn,
      cover_image: cover_image,
      rating: rating,
      }    

    console.log("my book",bookData);
        
    try {
      const response = await fetch(`http://52.66.202.110:8000/api/v1/user/${userId}/books/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        const newBook = await response.json();
        console.log('book added successfully:', newBook);
        setAccessToken("VALID");
        closefunc();
        setTimeout(() => {
            router.reload();
        }, 20);

      } else {
        console.error('Failed to add book:', response.status);
        setAccessToken("INVALID");
        // Handle error: response.status, response.statusText, etc.
      }
    } catch (error) {
      console.error('Error adding book:', error);
      // Handle other errors like network issues, etc.
    }
  };



  return (
    <div>
            {/* <ToastComponent /> */}
      <Container component="main" maxWidth="xs" className='bg-slate-300 rounded-lg'>
        <CssBaseline />
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' ,   
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'right' }}>
            <CloseIcon  onClick = {()=>{closefunc()}}/>
        </Avatar>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <BookIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className='text-emerald-800'>
            Add a Book
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="title"
                  fullWidth
                  name="title"
                  required
                  id="title"
                  label="Title"
                  autoFocus
                />
                {!isTitleSet &&  !isInitial && <span className='text-red-900'>This field is required</span>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="author"
                  label="Author"
                  name="author"
                  autoComplete="Author"
                />
                {!isAuthorSet &&  !isInitial && <span className='text-red-900'>This field is required</span>}
              </Grid>
              <Grid item xs={12} sm={6}>

                <TextField
                  fullWidth
                  id="published_date"
                  label="Published Date"
                  name="published_date"
                  autoComplete="published_date"
                />
               
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="isbn"
                  label="ISBN"
                  id="isbn"
                  autoComplete="isbn"
                />
              
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="cover_image"
                  label="Cover Image URL"
                  id="cover_image"
                  autoComplete="cover_image"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="rating"
                  label="Rating"
                  id="rating"
                  autoComplete="rating"
                />
              </Grid>
 
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className='text-emerald-100 bg-emerald-600 hover:bg-emerald-800'
            >
              ADD
            </Button>
          
            <Grid container justifyContent="center" alignItems="center">
              <Grid item className='mb-8 text-center'>
              {accessToken === 'VALID'&& <span className='text-green-900'>SUCCESS !</span>} 
              {accessToken === 'INVALID' &&  <span className='text-red-900'>Failed to add the book!</span>}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
</div>
  );
}