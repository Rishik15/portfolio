import {
    MUSIC_MONTHLY_PLAY_LIMIT,
    MUSIC_QUOTA_MAX_ENTRIES,
} from "@/config/music";

import { createPlayQuota } from "./quota";

export const playQuota = createPlayQuota({
    limit: MUSIC_MONTHLY_PLAY_LIMIT,
    maxEntries: MUSIC_QUOTA_MAX_ENTRIES,
});
