import axios from 'axios';
import ProfileForm from './profile-form';
import classes from './user-profile.module.css';

function UserProfile() {
  const changePasswordHandler = async (passwordData) => {
    try {
      const response = await axios.patch(
        '/api/user/change-password',
        passwordData
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler} />
    </section>
  );
}

export default UserProfile;
