const candidatesReducer = (candidates = [], action) => {
    switch (action.type) {
        case 'CANDIDATES_DELETE':
            return candidates.filter((candidate) => candidate._id !== action.payload);
        case 'CANDIDATES_UPDATE':
            return candidates.map((candidate) => candidate._id === action.payload._id ? action.payload : candidate)
        case 'CANDIDATES_FETCH_ALL':
            return action.payload;
        case 'CANDIDATES_CREATE':
            return [...candidates, action.payload];
        default:
            return candidates;

    }
}

export default candidatesReducer;