import * as api from '../api';

export const getNumbers = () => async (dispatch) => {

    try {
        const { data } = await api.fetchGeneralNumbers();
        dispatch({ type: 'UPDATE_GENERAL_NUMBERS', payload: data });
    } catch (error) {
        console.error(error);
    }
}