import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from 'next/link'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useRouter } from 'next/router'
import { useEffect } from "react";

/*
  "username": "mahinda",
  "email": "m@gmail.com",
  "full_name": "Mahinda Rajapaksha",
  "disabled": 0,
  "password": "hello123"
*/


const defaultTheme = createTheme();

export default function SignUp() {
    

    const [userId, setUserId] = useState(false);

  useEffect(() => {
    // Perform localStorage action
    setUserId( sessionStorage.getItem("user_id"));
  }, [])

  

  const router = useRouter();

  console.log(`user id --  ${userId}`);
  
  if (userId){
    router.push(`/dashboard/`);
  }

  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const [isFullnameSet, setIsFullnameSet] = useState(false);
  const [isEmailSet, setIsEmailSet] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const [accessToken, setAccessToken] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setIsInitial(false);
    if  (data.get('username').length > 0){
      setIsUsernameSet(true);
    }
    else{
      setIsUsernameSet(false);
    }
    if  (data.get('password').length > 0){
      setIsPasswordSet(true);
    }else{
      setIsPasswordSet(false);
    }
    if  (data.get('fullname').length > 0){
        setIsFullnameSet(true);
    }else{
        setIsFullnameSet(false);
    }
    if  (data.get('email').length > 0){
        setIsEmailSet(true);
    }else{
        setIsEmailSet(false);
    }
    if (data.get('email').length > 0 && data.get('password').length > 0 && data.get('fullname').length > 0 && data.get('email').length > 0){
      handleSignUp(data.get('username'),data.get('password'),data.get('fullname'),data.get('email'));

    }

  };


  const handleSignUp = async (username,password,fullname,email) => {
    const userData = {
            username: username,
            email: email,
            full_name: fullname,
            disabled: 0,
            password: password,
        }    
        
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const newUser = await response.json();
        console.log('User created successfully:', newUser);
        setAccessToken("VALID");
        setTimeout(() => {
            router.push('/');
        }, 2000);
    
      } else {
        console.error('Failed to create user:', response.status);
        setAccessToken("INVALID");
        // Handle error: response.status, response.statusText, etc.
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle other errors like network issues, etc.
    }
  };



  return (
    <div  style={{
        backgroundImage: `url('/bg2.jpg')`,
        backgroundSize: 'cover',
         height: "100vh",
         width: "100vw",
         paddingTop : "100px"
  
        }}>
            {/* <ToastComponent /> */}
      <Container component="main" maxWidth="xs" className='bg-slate-300 rounded-lg'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className='text-emerald-800'>
            Sign up to Your Personal Library
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="Username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                />
                {!isUsernameSet &&  !isInitial && <span className='text-red-900'>This field is required</span>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="fullname"
                  label="Full Name"
                  name="fullname"
                  autoComplete="full-name"
                />
                {!isFullnameSet &&  !isInitial && <span className='text-red-900'>This field is required</span>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
                {!isEmailSet &&  !isInitial && <span className='text-red-900'>This field is required</span>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
                {!isPasswordSet &&  !isInitial && <span className='text-red-900'>This field is required</span>}
              </Grid>
          
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className='text-emerald-100 bg-emerald-600 hover:bg-emerald-800'
            >
              Sign Up
            </Button>
          
            <Grid container justifyContent="center" alignItems="center" className='mb-8'>
              <Grid item className='mb-8 text-center'>
              {accessToken === 'VALID'&& <span className='text-green-900'>SUCCESS !</span>} 
              {accessToken === 'INVALID' &&  <span className='text-red-900'>Username or Email already exists. try again!</span>}
              <br/>
                <Link href="/" variant="body2"  className='text-sky-900 m-16'>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
</div>
  );
}