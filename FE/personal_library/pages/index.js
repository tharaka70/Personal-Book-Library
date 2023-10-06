import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
// import Link from '@mui/material/Link';
import Link from 'next/link'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { useRouter } from 'next/router'
import { useEffect } from "react";


const defaultTheme = createTheme();

export default function SignIn() {
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
  const [isInitial, setIsInitial] = useState(true);
  const [accessToken, setAccessToken] = useState(false);


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setIsInitial(false);
    if  (data.get('email').length > 0){
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
    if (data.get('email').length > 0 && data.get('password').length > 0){
      handleTokenFetch(data.get('email'),data.get('password'))

    }
  };

  const handleTokenFetch = async (username,password) => {
    try {
      const response = await fetch('http://52.66.202.110:8000/token', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`
      });

      if (response.status === 200) {
        const data = await response.json();
        setAccessToken(data.access_token);
        console.log(data);
        sessionStorage.setItem("user_id", data.id);
        sessionStorage.setItem("token", data.access_token);
        setTimeout(() => {
          setUserId(data.id);
        }, 2000);
        

      } else {
        console.error('Error: Invalid credentials');
        setAccessToken("INVALID");
      }
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };



  return (
    !userId && ( <div  style={{
      backgroundImage: `url('/bg2.jpg')`,
      backgroundSize: 'cover',
       height: "100vh",
       width: "100vw",
       paddingTop : "100px"

      }}>
      <Container component="main" maxWidth="xs" className='bg-slate-300 rounded-lg' >
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
            Sign in to Your Personal Library
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username"
              name="email"
              autoComplete="email"
              autoFocus
              color="primary"
            />
             {!isUsernameSet && !isInitial && <span className='text-red-900'>This field is required</span>}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              color="primary"
            />
             {!isPasswordSet &&  !isInitial && <span className='text-red-900'>This field is required</span>}
            {/* <FormControlLabel
              control={<Checkbox value="remember" />}
              label="Remember me"
              className='text-sky-900'
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className='text-emerald-100 bg-emerald-600 hover:bg-emerald-800'
            >
              Sign In
            </Button>
            
            <Grid container justifyContent="center" alignItems="center" className='mb-8'>
              <Grid item className='mb-8 text-center'>
              {accessToken === 'INVALID' &&  <span className='text-red-900'>Invalid credentials please try again!</span>}
              {accessToken && accessToken !== 'INVALID'&& <span className='text-green-900'>LOGIN SUCCESS !</span>}
              <br/>
                <Link href="/signup" variant="body2"  className='text-sky-900'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>)
  );
}