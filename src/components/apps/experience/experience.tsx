"use client";

import { useMemo, useState } from "react";

import { ExperienceDetail } from "@/components/apps/experience/experience-detail";
import { ExperienceSidebar } from "@/components/apps/experience/experience-sidebar";
import { ExperienceStatusBar } from "@/components/apps/experience/experience-status-bar";
import { EXPERIENCE_UI } from "@/components/apps/experience/experience-ui";
import {
    EXPERIENCES,
    type Experience as ExperienceItem,
} from "@/config/experience";

export function Experience() {
    const [selectedExperienceId, setSelectedExperienceId] = useState<
        string | null
    >(() => EXPERIENCES[0]?.id ?? null);

    const selectedExperience = useMemo<ExperienceItem | null>(() => {
        if (!selectedExperienceId) {
            return null;
        }

        return (
            EXPERIENCES.find(
                (experience) => experience.id === selectedExperienceId,
            ) ?? null
        );
    }, [selectedExperienceId]);

    return (
        <div className={EXPERIENCE_UI.root}>
            <div className={EXPERIENCE_UI.main}>
                <ExperienceSidebar
                    experiences={EXPERIENCES}
                    selectedExperienceId={selectedExperienceId}
                    onSelectExperience={setSelectedExperienceId}
                />

                <ExperienceDetail experience={selectedExperience} />
            </div>

            <ExperienceStatusBar
                count={EXPERIENCES.length}
                experience={selectedExperience}
            />
        </div>
    );
}
