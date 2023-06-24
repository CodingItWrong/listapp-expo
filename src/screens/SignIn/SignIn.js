import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import oauthLogin from '../../auth/oauthLogin';
import useLoginForm from '../../auth/useLoginForm';
import Button from '../../components/Button';
import CenterColumn from '../../components/CenterColumn';
import ErrorMessage from '../../components/ErrorMessage';
import NavigationBar from '../../components/NavigationBar';
import ScreenBackground from '../../components/ScreenBackground';
import Stack from '../../components/Stack';
import TextField from '../../components/TextField';
import httpClient from '../../data/httpClient';
import {useToken} from '../../data/token';

const client = httpClient();

export default function SignIn() {
  const {isLoggedIn, setToken} = useToken();
  const navigate = useNavigate();
  const onLogIn = ({username, password}) =>
    oauthLogin({
      httpClient: client,
      username,
      password,
    }).then(setToken);
  const {username, password, error, handleChange, handleLogIn} =
    useLoginForm(onLogIn);

  function handleSubmit(e) {
    e.preventDefault();
    handleLogIn();
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/boards');
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <NavigationBar options={{title: 'Riverbed'}} />
      <ScreenBackground style={styles.container}>
        <CenterColumn>
          <form onSubmit={handleSubmit}>
            <Stack spacing={1}>
              <TextField
                label="Email"
                testID="text-input-email"
                value={username}
                onChangeText={handleChange('username')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect="off"
              />
              <TextField
                label="Password"
                testID="text-input-password"
                value={password}
                onChangeText={handleChange('password')}
                secureTextEntry
              />
              <ErrorMessage>{error}</ErrorMessage>
              <Button type="submit" mode="primary">
                Sign in
              </Button>
            </Stack>
          </form>
        </CenterColumn>
      </ScreenBackground>
    </>
  );
}

const styles = {
  container: {
    padding: 16,
  },
};
