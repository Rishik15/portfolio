import { Dock } from "@/components/desktop/dock";
import { TopBar } from "@/components/desktop/top-bar";

import styles from "./desktop.module.css";

export function Desktop() {
    return (
        <main className={styles.desktop}>
            <TopBar />
            <Dock />
        </main>
    );
}
