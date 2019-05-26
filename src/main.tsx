import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { configureStore, loadState, saveState } from "./store";
import { App } from ".";
import { debounce } from "lodash";

const persistedState = loadState();

const store = configureStore(history, persistedState);

store.subscribe(
    debounce(() => {
        const currentState = store.getState();
        if (currentState.requestedDataState.enableAutoSave) {
            saveState(currentState);
        }
    }, 500)
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
