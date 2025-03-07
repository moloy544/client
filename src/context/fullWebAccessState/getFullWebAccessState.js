import { useSelector } from "react-redux"

export const getFullWebAccessState = ()=>{
    const state = useSelector((state) => state.fullWebAccessState);
    return state;
}