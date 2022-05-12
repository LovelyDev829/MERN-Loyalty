/* eslint-disable no-console */
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  makeStyles
} from '@material-ui/core';
import { updateProfile } from 'src/actions/accountActions';

const useStyles = makeStyles((theme) => ({
  root: {},
  name: {
    marginTop: theme.spacing(1)
  },
  avatar: {
    height: 100,
    width: 100,
    '&:hover': {
      boxShadow: 'none',
      backgroundColor: '#bdbdbd',
      cursor: 'pointer',
    }
  }
}));

function ProfileDetails({ user, className, ...rest }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const form = useRef(null);
  const [avatarHover, setAvatarHover] = useState(false);
  const avatarInputFile = useRef(null);
  const formSubmit = useRef(null);

  const changeHandler = (e) => {
    const file = e.target.files[0];
    console.log("file", file);
    if (file.size > 1024 * 1024 * 10) {
      console.log('Error: File size cannot exceed more than 10MB');
      return;
    }

    setSelectedFile(file);
    setIsFilePicked(true);
  };

  const handleSubmission = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      await dispatch(updateProfile(formData));
      enqueueSnackbar('Profile image updated', {
        variant: 'success'
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleSubmissionClearAvatar = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('clearAvatar', '1');

    try {
      await dispatch(updateProfile(formData));
      enqueueSnackbar('Profile image Cleared', {
        variant: 'success'
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box>
          <div>
            <form ref={form} onSubmit={handleSubmission}>
              <input type="file" id="avatarFile" ref={avatarInputFile} style={{ display: 'none' }} onChange={changeHandler} />
              <div>
                <Button type="submit" id="formSubmit" ref={formSubmit} style={{ display: 'none' }}>Submit</Button>
              </div>
            </form>
          </div>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          textAlign="center"
        >
          <Avatar
            className={classes.avatar}
            onMouseEnter={() => {
              setAvatarHover(true);
            }}
            onMouseLeave={() => {
              setAvatarHover(false);
            }}
            src={avatarHover ? '' : user.avatar}
            onClick={() => { avatarInputFile.current.click(); }}
          >
            Upload
          </Avatar>
          <Typography
            className={classes.name}
            gutterBottom
            variant="h3"
            color="textPrimary"
          >
            {`${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography
            color="textPrimary"
            variant="body1"
          >
            {`${user.state}, ${user.country}`}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {user.timezone}
          </Typography>
        </Box>
      </CardContent>
      { selectedFile && (
        <CardActions>
          <Button
            fullWidth
            variant="text"
            onClick={() => { formSubmit.current.click(); }}
          >
            Save picture
          </Button>
        </CardActions>
      )}
      <CardActions>
        <Button
          fullWidth
          variant="text"
          onClick={handleSubmissionClearAvatar}
        >
          Remove picture
        </Button>
      </CardActions>
    </Card>
  );
}

ProfileDetails.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired
};

export default ProfileDetails;
