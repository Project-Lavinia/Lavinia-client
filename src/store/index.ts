import { Store, createStore, applyMiddleware } from "redux";
import { logger } from "../middleware";
import { RootState, rootReducer } from "../reducers";

export function configureStore(history: History, initialState?: RootState): Store<RootState> {
    let middleware = applyMiddleware();

    if (process.env.NODE_ENV !== "production") {
        middleware = applyMiddleware(logger);
    }

    const store = createStore(rootReducer, initialState, middleware);

    if (module.hot) {
        module.hot.accept("../reducers", () => {
            const nextReducer = require("../reducers");
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}

export * from "./local-storage";
