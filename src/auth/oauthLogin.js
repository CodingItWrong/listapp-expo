const DEFAULT_PATH = 'oauth/token';
const DEFAULT_ERROR_MESSAGE =
  'An error occurred while logging in. Please try again.';

const oauthLogin = ({httpClient, path = DEFAULT_PATH, username, password}) =>
  httpClient
    .post(
      path,
      {
        grant_type: 'password',
        username,
        password,
      },
      {headers: {'Content-Type': 'application/json'}},
    )
    .then(response => ({
      accessToken: response.data.access_token,
      userId: response.data.user_id,
    }))
    .catch(handleErrorResponse);

function handleErrorResponse(error) {
  let message;
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.error_description
  ) {
    message = error.response.data.error_description;
  } else {
    message = DEFAULT_ERROR_MESSAGE;
  }
  throw message;
}

export default oauthLogin;
