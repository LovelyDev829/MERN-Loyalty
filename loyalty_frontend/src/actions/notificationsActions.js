import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';

export const GET_NOTIFICATIONS = '@notifications/get-notifications';

export function getNotifications() {
  // const request = axios.get('/api/notifications');
  const request = axios.get(`${API_BASE_URL}/notification`);

  return (dispatch) => {
    request.then((response) => dispatch({
      type: GET_NOTIFICATIONS,
      payload: response.data
    }));
  };
}
