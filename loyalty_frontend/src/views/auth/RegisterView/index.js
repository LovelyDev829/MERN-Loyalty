import React, {
  useState,
  useCallback,
  useEffect
} from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Logo from 'src/components/Logo';
import { API_BASE_URL } from 'src/config';
import RegisterForm from './RegisterForm';

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: 'center',
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    minHeight: '100%',
    flexDirection: 'column',
    paddingBottom: 80,
    paddingTop: 80
  },
  wrapperForError: {
    height: '250px',
  },
  headerForErrorWrapper: {
    marginTop: '30px',
  },
  contentForErrorWrapper: {
    marginTop: '50px',
  }
}));

function RegisterView() {
  const classes = useStyles();
  const history = useHistory();
  const isMountedRef = useIsMountedRef();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  const [verifiedEmail, setVerifiedEmail] = useState(-2);

  const getVerifiedEmail = useCallback(() => {
    axios
      .post(`${API_BASE_URL}/admin/user/get-verified-email/${email}`)
      .then((response) => {
        if (isMountedRef.current) {
          if (response.data.status) {
            if (response.data.verifiedEmail) {
              setVerifiedEmail(1);
            } else {
              setVerifiedEmail(0);
            }
          } else {
            setVerifiedEmail(-1);
          }
        }
      });
  }, [isMountedRef]);

  useEffect(() => {
    getVerifiedEmail();
  }, []);

  if (verifiedEmail === -2) {
    return null;
  }

  const handleSubmitSuccess = () => {
    history.push('/app/login');
  };

  return (
    <Page
      className={classes.root}
      title="Register"
    >
      <Container maxWidth="sm">
        <Box
          mb={5}
          display="flex"
          alignItems="center"
        >
          <RouterLink to="/">
            <Logo />
          </RouterLink>
          <Button
            component={RouterLink}
            to="/"
            className={classes.backButton}
          >
            Back to home
          </Button>
        </Box>
        <Card>
          <CardContent>
            <Typography
              gutterBottom
              variant="h2"
              color="textPrimary"
            >
              Sign up
            </Typography>
            <Typography variant="subtitle1">
              Sign up on the internal platform
            </Typography>
            <Box mt={3}>
              {verifiedEmail === 0 && (
              <RegisterForm onSubmitSuccess={handleSubmitSuccess} email={email} />
              )}
            </Box>
            <Box mt={3} className={classes.wrapperForError}>
              {verifiedEmail === 1 && (
              <>
                <Divider />
                <Typography
                  align="center"
                  variant="h3"
                  color="textPrimary"
                  className={classes.headerForErrorWrapper}
                >
                  You can&apos;t signup twice.
                </Typography>
                <Typography
                  align="center"
                  variant="subtitle2"
                  color="textSecondary"
                  className={classes.contentForErrorWrapper}
                >
                  If you signed up before, you can&apos;t signup again.
                </Typography>
              </>
              )}
              {verifiedEmail === -1 && (
              <>
                <Divider />
                <Typography
                  align="center"
                  variant="h3"
                  color="textPrimary"
                  className={classes.headerForErrorWrapper}
                >
                  You are not allowed to signup here.
                </Typography>
                <Typography
                  align="center"
                  variant="subtitle2"
                  color="textSecondary"
                  className={classes.contentForErrorWrapper}
                >
                  If admin does not create user for you, you can&apos;t signup.
                  <br />
                  Contact to Loyalty admin.
                </Typography>
              </>
              )}
            </Box>
            <Box my={2}>
              <Divider />
            </Box>
            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              color="textSecondary"
            >
              Have an account?
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default RegisterView;
