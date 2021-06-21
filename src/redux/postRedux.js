import {ISAUTH, PRELOADER} from "./type";

const initial = {
    preloader: false,
    isAuth: false,
}

export const postRedux = (state = initial, action) => {
    switch (action.type) {
        case PRELOADER:
            return {
                ...state,
                preloader: action.payload
            }

        case ISAUTH:
            return {
                ...state,
                isAuth: action.payload
            }


        default: return state
    }
}