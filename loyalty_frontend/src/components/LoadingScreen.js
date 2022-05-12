import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import { Box, LinearProgress, makeStyles } from '@material-ui/core';
// import ReactLoading from 'react-loading';

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    minHeight: '100%',
    padding: theme.spacing(3)
  }
}));

function LoadingScreen() {
  const classes = useStyles();

  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div className={classes.root}>
      <Box width={400}>
        <LinearProgress />
        {/* <ReactLoading
          type="bubbles"
          color="rgba(88,80,236,1)"
          height="100px"
          width="120px"
        /> */}
      </Box>
    </div>
  );
}

export default LoadingScreen;
