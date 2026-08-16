"use client";

import { useMemo, useState } from "react";

import {
    EXPERIENCES,
    type Experience as ExperienceItem,
} from "@/config/experience";

import { ExperienceDetail } from "./experience-detail";
import { ExperienceSidebar } from "./experience-sidebar";
import { ExperienceStatusBar } from "./experience-status-bar";

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
        <div className="flex h-full min-h-0 flex-col bg-background">
            <div className="flex min-h-0 flex-1">
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
