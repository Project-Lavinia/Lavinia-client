import { Store, createStore, applyMiddleware } from "redux";
// tslint:disable-next-line:no-implicit-dependencies
import { composeWithDevTools } from "redux-devtools-extension";
import { routerMiddleware } from "react-router-redux";
import { History } from "history";
import { logger } from "../middleware";
import { RootState, rootReducer } from "../reducers";

export function configureStore(history: History, initialState?: RootState): Store<RootState> {
    let middleware = applyMiddleware(logger, routerMiddleware(history));

    if (process.env.NODE_ENV !== "production") {
        middleware = composeWithDevTools(middleware);
    }

    const store = createStore(rootReducer as any, initialState as any, middleware) as Store<RootState>;

    if (module.hot) {
        module.hot.accept("app/reducers", () => {
            const nextReducer = require("../reducers");
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
