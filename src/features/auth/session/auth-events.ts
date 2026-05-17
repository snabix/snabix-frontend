export const AUTH_UNAUTHORIZED_EVENT = "snabix:auth:unauthorized";

export function notifyUnauthorized() {
    if (typeof window === "undefined") {
        return;
    }

    window.dispatchEvent(
        new Event(
            AUTH_UNAUTHORIZED_EVENT
        )
    );
}
