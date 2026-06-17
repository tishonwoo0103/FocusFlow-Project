import type {
  CurriculumStage,
  ProjectStatus,
  ResearchDomain,
  Task,
  VibeCodingItem,
  WixDevelopmentItem
} from "@/types";
import { summerBuildTasks } from "@/lib/summerSchedule";

export const createId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const todayIso = () => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  return toIsoDate(date);
};

export const defaultProjectStatus: ProjectStatus = {
  currentObjective: "Complete the 66-day summer build plan for the FocusFlow Wix website and Grade 10 pilot.",
  currentFocus: "Prepare the Blueprint stage and start the first scheduled build task on June 21.",
  currentStage: 1,
  progressPercentage: 0
};

export const getDefaultTasks = (): Task[] => summerBuildTasks.map((task) => ({ ...task, checklist: [...task.checklist] }));

export const getDefaultCurriculumStages = (): CurriculumStage[] => [
  {
    id: "curriculum-wix-basics",
    stageNumber: 1,
    title: "Wix Basics",
    description: "Learn the editor, publishing flow, theme controls, and section structure.",
    status: "Learning",
    howToLearn: {
      explanation: "Wix Basics gives you the control language for building without feeling lost in the editor.",
      workflow: "Watch one short overview, then immediately recreate a tiny page section in your own site.",
      steps: ["Open the Wix editor", "Find pages, sections, preview, and publish", "Create one test section", "Preview on desktop and mobile"]
    },
    resources: [
      { id: "resource-basics-youtube", type: "YouTube", label: "Wix editor basics video", url: "" },
      { id: "resource-basics-docs", type: "Documentation", label: "Wix editor help docs", url: "" },
      { id: "resource-basics-article", type: "Article", label: "Beginner Wix setup article", url: "" }
    ],
    notes: "Keep this stage practical. Do not learn every panel before building.",
    nextStep: "Create a one-section test page and preview it on mobile."
  },
  {
    id: "curriculum-pages",
    stageNumber: 2,
    title: "Pages",
    description: "Plan and build the main FocusFlow page structure.",
    status: "Not Started",
    howToLearn: {
      explanation: "Pages are the backbone of the FocusFlow website architecture.",
      workflow: "Define page purpose first, then build only the pages needed for the first pilot.",
      steps: ["List required pages", "Write one goal for each page", "Create pages in Wix", "Add simple navigation"]
    },
    resources: [
      { id: "resource-pages-youtube", type: "YouTube", label: "Wix pages tutorial", url: "" },
      { id: "resource-pages-docs", type: "Documentation", label: "Wix pages documentation", url: "" },
      { id: "resource-pages-article", type: "Article", label: "Website structure article", url: "" }
    ],
    notes: "Start with Home, Learn, Assessment, Evidence, and Contact.",
    nextStep: "Create the FocusFlow page map."
  },
  {
    id: "curriculum-forms",
    stageNumber: 3,
    title: "Forms",
    description: "Use forms for feedback, interest, and the first survey pathway.",
    status: "Not Started",
    howToLearn: {
      explanation: "Forms are the simplest way to collect pilot input before a custom survey system exists.",
      workflow: "Prototype one short form, inspect submissions, then decide what the real survey needs.",
      steps: ["Create a test form", "Add basic question types", "Submit test responses", "Review the submission table"]
    },
    resources: [
      { id: "resource-forms-youtube", type: "YouTube", label: "Wix forms tutorial", url: "" },
      { id: "resource-forms-docs", type: "Documentation", label: "Wix forms documentation", url: "" },
      { id: "resource-forms-article", type: "Article", label: "Survey form design article", url: "" }
    ],
    notes: "Collect only information that directly supports the pilot.",
    nextStep: "Draft the first three survey questions."
  },
  {
    id: "curriculum-cms",
    stageNumber: 4,
    title: "CMS",
    description: "Use collections only when repeated content becomes hard to maintain manually.",
    status: "Not Started",
    howToLearn: {
      explanation: "CMS is useful for evidence cards, resource libraries, and repeated modules.",
      workflow: "Learn the collection idea with one small test before using it on the real site.",
      steps: ["Create a test collection", "Add title, category, summary, and link fields", "Add three sample items", "Connect the collection to a page"]
    },
    resources: [
      { id: "resource-cms-youtube", type: "YouTube", label: "Wix CMS tutorial", url: "" },
      { id: "resource-cms-docs", type: "Documentation", label: "Wix CMS documentation", url: "" },
      { id: "resource-cms-article", type: "Article", label: "CMS planning article", url: "" }
    ],
    notes: "Avoid CMS until the repeated content pattern is clear.",
    nextStep: "Decide whether the Evidence Library should become a CMS collection."
  },
  {
    id: "curriculum-dashboards",
    stageNumber: 5,
    title: "Dashboards",
    description: "Learn how to show useful progress and result summaries without overbuilding.",
    status: "Not Started",
    howToLearn: {
      explanation: "Dashboards should turn information into a next action for students.",
      workflow: "Start with static mock data, then add real data only when the pilot needs it.",
      steps: ["Choose two student signals", "Sketch a dashboard card", "Build a static version", "Review if it leads to a clear action"]
    },
    resources: [
      { id: "resource-dashboards-youtube", type: "YouTube", label: "Wix dashboard tutorial", url: "" },
      { id: "resource-dashboards-docs", type: "Documentation", label: "Wix dashboard documentation", url: "" },
      { id: "resource-dashboards-article", type: "Article", label: "Dashboard design article", url: "" }
    ],
    notes: "Dashboard work comes after the survey idea is stable.",
    nextStep: "Sketch the first FocusFlow result summary card."
  }
];

const createEvidence = (domainId: string): ResearchDomain["evidence"] => [
  {
    id: `${domainId}-evidence-1`,
    source: "Evidence 1",
    summary: "Add a concise source summary here.",
    establishes: "State what this source proves or supports for FocusFlow."
  },
  {
    id: `${domainId}-evidence-2`,
    source: "Evidence 2",
    summary: "Add a concise source summary here.",
    establishes: "State what this source proves or supports for FocusFlow."
  },
  {
    id: `${domainId}-evidence-3`,
    source: "Evidence 3",
    summary: "Add a concise source summary here.",
    establishes: "State what this source proves or supports for FocusFlow."
  }
];

const slugify = (value: string) =>
  value
    .split("")
    .map((char) => {
      if (char === " ") {
        return "-";
      }

      if (char >= "A" && char <= "Z") {
        return String.fromCharCode(char.charCodeAt(0) + 32);
      }

      return char;
    })
    .join("");

export const getDefaultResearchDomains = (): ResearchDomain[] =>
  ["Digital Habits", "Sleep", "Attention", "Stress", "Behavior Change", "Neuroscience"].map((name) => {
    const id = slugify(name);
    return { id, name, evidence: createEvidence(id) };
  });

const checklist = (prefix: string, labels: string[]) =>
  labels.map((label, index) => ({
    id: `${prefix}-check-${index + 1}`,
    label,
    done: index === 0
  }));

export const getDefaultVibeCodingItems = (): VibeCodingItem[] => [
  {
    id: "vibe-founder-os",
    feature: "Founder OS",
    status: "Building",
    notes: "Keep the project headquarters simple, focused, and easy to maintain.",
    checklist: checklist("vibe-founder-os", ["Define core screens", "Remove outdated concepts", "Verify local workflow"]),
    completion: 55
  },
  {
    id: "vibe-dashboard",
    feature: "Dashboard",
    status: "Building",
    notes: "Make the roadmap and current build stage obvious at a glance.",
    checklist: checklist("vibe-dashboard", ["Show roadmap stages", "Add progress control", "Group upcoming tasks"]),
    completion: 65
  },
  {
    id: "vibe-task-system",
    feature: "Task System",
    status: "Review",
    notes: "Calendar tasks should help the founder decide what to do on a specific day.",
    checklist: checklist("vibe-task-system", ["Add monthly calendar", "Add checkbox completion", "Add estimated time"]),
    completion: 80
  },
  {
    id: "vibe-research-hub",
    feature: "Research Hub",
    status: "Drafting",
    notes: "Organize evidence by FocusFlow domains before adding real sources.",
    checklist: checklist("vibe-research-hub", ["Create domains", "Add evidence slots", "Write source summaries"]),
    completion: 45
  },
  {
    id: "vibe-learning-center",
    feature: "Learning Center",
    status: "Drafting",
    notes: "Guide Wix learning through the skills needed for the current build.",
    checklist: checklist("vibe-learning-center", ["Create stages", "Add how-to-learn sections", "Add resource links"]),
    completion: 50
  },
  {
    id: "vibe-roadmap",
    feature: "Roadmap",
    status: "Building",
    notes: "Keep the strategic build path visible across the app.",
    checklist: checklist("vibe-roadmap", ["Define stages", "Track current stage", "Connect roadmap to daily work"]),
    completion: 70
  }
];

export const getDefaultWixDevelopmentItems = (): WixDevelopmentItem[] => [
  {
    id: "page-home",
    page: "Home",
    status: "Drafting",
    notes: "Explain what FocusFlow is and who it helps.",
    checklist: checklist("page-home", ["Draft hero message", "Add section outline", "Preview mobile layout"]),
    completion: 35
  },
  {
    id: "page-learn",
    page: "Learn",
    status: "Planned",
    notes: "Explain project ideas in student-friendly language.",
    checklist: checklist("page-learn", ["Define topics", "Draft learning cards", "Connect resources"]),
    completion: 10
  },
  {
    id: "page-assessment",
    page: "Assessment",
    status: "Planned",
    notes: "Connect to the survey system once ready.",
    checklist: checklist("page-assessment", ["Draft survey intro", "Map form fields", "Plan results handoff"]),
    completion: 5
  },
  {
    id: "page-dashboard",
    page: "Dashboard",
    status: "Planned",
    notes: "Preview the future student dashboard concept.",
    checklist: checklist("page-dashboard", ["Pick student signals", "Sketch result cards", "Write next-action copy"]),
    completion: 5
  },
  {
    id: "page-resources",
    page: "Resources",
    status: "Planned",
    notes: "Collect practical tools and guides for students.",
    checklist: checklist("page-resources", ["List resources", "Group by use case", "Draft short descriptions"]),
    completion: 0
  },
  {
    id: "page-research",
    page: "Research",
    status: "Planned",
    notes: "Show the evidence behind FocusFlow in a clear library.",
    checklist: checklist("page-research", ["Choose domains", "Add source summaries", "Connect claims to product choices"]),
    completion: 0
  },
  {
    id: "page-community",
    page: "Community",
    status: "Planned",
    notes: "Create a simple path for student or school participation.",
    checklist: checklist("page-community", ["Define audience", "Draft participation options", "Add contact path"]),
    completion: 0
  },
  {
    id: "page-contact",
    page: "Contact",
    status: "Planned",
    notes: "Create a simple contact path for feedback and collaboration.",
    checklist: checklist("page-contact", ["Draft contact copy", "Add form fields", "Test submission flow"]),
    completion: 0
  }
];
