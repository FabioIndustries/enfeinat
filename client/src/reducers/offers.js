const offersReducer = (offers = [], action) => {
    switch (action.type) {
        case 'OFFERS_DELETE':
            return offers.filter((offer) => offer._id !== action.payload);
        case 'OFFERS_UPDATE':
            return offers.map((offer) => offer._id === action.payload._id ? action.payload : offer)
        case 'OFFERS_FETCH_ALL':
            return action.payload;
        case 'OFFERS_CREATE':
            return [...offers, action.payload];
        default:
            return offers;

    }
}

export default offersReducer;