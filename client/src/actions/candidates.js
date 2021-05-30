import * as api from "../api";
import { getNumbers } from "./general";

export const getCandidates = () => async (dispatch) => {
  try {
    const { data } = await api.fetchCandidates();
    dispatch({ type: "CANDIDATES_FETCH_ALL", payload: data });
  } catch (error) {
    console.error(error);
  }
};

export const createCandidate = (candidate) => async (dispatch) => {
  try {
    const { data } = await api.createCandidate(candidate);
    dispatch({ type: "CANDIDATES_CREATE", payload: data });
    dispatch(getNumbers());
  } catch (error) {
    console.error(error);
  }
};

export const updateCandidate = (id, candidate) => async (dispatch) => {
  try {
    const { data } = await api.updateCandidate(id, candidate);
    dispatch({ type: "CANDIDATES_UPDATE", payload: data });
  } catch (error) {
    console.error(error);
  }
};

export const deleteCandidate = (id) => async (dispatch) => {
  try {
    await api.deleteCandidate(id);
    dispatch({ type: "CANDIDATES_DELETE", payload: id });
    dispatch(getNumbers());
  } catch (error) {
    console.error(error);
  }
};
