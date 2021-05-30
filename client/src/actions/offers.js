import * as api from "../api";
import { getNumbers } from "./general";

export const getOffers = () => async (dispatch) => {
  try {
    const { data } = await api.fetchOffers();
    dispatch({ type: "OFFERS_FETCH_ALL", payload: data });
  } catch (error) {
    console.error(error);
  }
};

export const createOffer = (offer) => async (dispatch) => {
  try {
    const { data } = await api.createOffer(offer);
    dispatch({ type: "OFFERS_CREATE", payload: data });
    dispatch(getNumbers());
  } catch (error) {
    console.error(error);
  }
};

export const updateOffer = (id, offer) => async (dispatch) => {
  try {
    const { data } = await api.updateOffer(id, offer);
    dispatch({ type: "OFFERS_UPDATE", payload: data });
  } catch (error) {
    console.error(error);
  }
};

export const deleteOffer = (id) => async (dispatch) => {
  try {
    await api.deleteOffer(id);
    dispatch({ type: "OFFERS_DELETE", payload: id });
    dispatch(getNumbers());
  } catch (error) {
    console.error(error);
  }
};
