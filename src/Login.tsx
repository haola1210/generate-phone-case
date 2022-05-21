import { 
  Grid, TextField, 
  Typography, Box, Button,
  FormControl
} from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import validate from './black';
import { useUserContext } from './UserContext';

const setHitoryInfo = (key: string) => {
  const data = {
    u: key,
    t: (new Date()).getTime() + 259200000
  }
  localStorage.setItem('black', JSON.stringify(data))
}

function Login() {

  const [isFilled, setFilled] = useState(false)
  const [code, setCode] = useState('')
  const [isErr, setErr] = useState(false)
  const { setUser } = useUserContext()
  
  const handleLogin = () => {
    const user = validate(code)
    setCode('')
    if(!user){
      setErr(true)
    } else {
      setHitoryInfo(user)
      setUser(user)
    }
  }

  useEffect(() => {
    code && !isFilled && setFilled(true)
    !code && isFilled && setFilled(false)
  }, [code])

  useEffect(() => {
    if(isErr){
      const timer = setTimeout(() => {
        setErr(false)
        clearTimeout(timer)
      }, 2000)
    }
  }, [isErr])


  return (
    <Grid 
      container spacing={2} 
      sx={{ 
        backgroudColor: 'white !important', 
        height: '100vh',
        width: '100vw',
        margin: 0
      }}
    >
      <Grid item  xs={8}>
        <Typography variant='h5' sx={{ mb: 5 }}>
          Login
        </Typography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': {mb: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <FormControl sx={{ width: '25ch' }}>
            <TextField 
              id="outlined-basic" label="Code" 
              variant="outlined" required 
              size="small" color="primary" focused
              placeholder="Please type code"
              onChange={(e : ChangeEvent<HTMLInputElement>) => {
                setCode(prev => e.target.value)
              }}  
              value={code}
            />
            <br/>
            { 
              isErr && <>
                <br />
                <Typography 
                  variant="caption" display="block" gutterBottom 
                  sx={{ color: 'red' }}
                >
                  invalid code!
                </Typography>
              </>
            }
            <Button 
              variant="outlined" 
              color="primary" size="small"
              disabled={!isFilled}
              onClick={handleLogin}
            >Login</Button>
          </FormControl>
        </Box>
      </Grid>
      <Grid item  xs={4}>
        <Typography variant='h6'>
          Want to use this tool?
        </Typography>
        <strong>
          contact me at zalo 0929770590
        </strong>
        {' '}
        <i>or just hack it</i>
      </Grid>
    </Grid>
  );
}

export default Login;