export default function (state, action) {
    switch (action.type) {
        case 'edit':
            return {
                ...state,
                status: !state.status,
                text: action.payload.text,
            };


        default:
            return state
    }
}