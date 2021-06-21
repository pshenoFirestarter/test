import {ISAUTH, PRELOADER} from "./type";

export function preloader(bool) {
    return {
        type: PRELOADER,
        payload: bool,
    }
}

export function authorize(bool) {
    return {
        type: ISAUTH,
        payload: bool,
    }
}

