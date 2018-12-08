export const logger = (store: any) => (next: any) => (action: any) => {
    console.log("dispatching", action);
    const result = next(action);
    console.log("next state", store.getState());
    return result;
};
