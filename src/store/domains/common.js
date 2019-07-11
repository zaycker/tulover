export const commonReducer = (ACTION_HANDLERS) => (state = {}, action) => {
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
};

export default {};
