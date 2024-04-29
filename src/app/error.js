'use client'

import SomthingWrongError from "./components/errors/SomthingWrongError"

export default function Error() {
    const reload = () => window.location.reload()
    return (
        <SomthingWrongError
            onclickEvent={reload}
             />
    )
}