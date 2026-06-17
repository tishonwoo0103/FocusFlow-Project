import type { BuildStage, Task, TaskCategory } from "@/types";

export const summerBuildStages: BuildStage[] = [
  {
    id: "stage-blueprint",
    stageNumber: 1,
    title: "Blueprint",
    goal: "Decide exactly what FocusFlow is and how the website should work.",
    startDate: "2026-06-21",
    endDate: "2026-06-27"
  },
  {
    id: "stage-program",
    stageNumber: 2,
    title: "Program",
    goal: "Build the 7-day Digital Behavior Reset program students will follow.",
    startDate: "2026-06-28",
    endDate: "2026-07-04"
  },
  {
    id: "stage-survey",
    stageNumber: 3,
    title: "Survey",
    goal: "Create the intake survey, daily check-in, weekly reflection, and behavior profiles.",
    startDate: "2026-07-05",
    endDate: "2026-07-11"
  },
  {
    id: "stage-wix-website",
    stageNumber: 4,
    title: "Wix Website",
    goal: "Build the main public-facing Wix website pages.",
    startDate: "2026-07-12",
    endDate: "2026-07-18"
  },
  {
    id: "stage-dashboard",
    stageNumber: 5,
    title: "Dashboard",
    goal: "Design the student tracking and analytics dashboard.",
    startDate: "2026-07-19",
    endDate: "2026-07-25"
  },
  {
    id: "stage-resources",
    stageNumber: 6,
    title: "Resources",
    goal: "Create articles, guides, videos, and bilingual support materials.",
    startDate: "2026-07-26",
    endDate: "2026-08-01"
  },
  {
    id: "stage-testing",
    stageNumber: 7,
    title: "Testing",
    goal: "Test the website, forms, dashboard, and user flow.",
    startDate: "2026-08-02",
    endDate: "2026-08-08"
  },
  {
    id: "stage-launch-prep",
    stageNumber: 8,
    title: "Launch Prep",
    goal: "Prepare everything for Grade 10 pilot launch.",
    startDate: "2026-08-09",
    endDate: "2026-08-25"
  }
];

type SummerTaskSeed = {
  date: string;
  stage: string;
  title: string;
  whatToDo: string;
  checklist: string[];
  deliverable: string;
};

const stageCategory = (stage: string): TaskCategory => {
  if (stage === "Survey") {
    return "Survey Design";
  }

  if (stage === "Wix Website") {
    return "Wix Development";
  }

  if (stage === "Dashboard") {
    return "Dashboard Design";
  }

  if (stage === "Resources") {
    return "Resources";
  }

  if (stage === "Testing") {
    return "Testing";
  }

  if (stage === "Launch Prep") {
    return "Launch Prep";
  }

  if (stage === "Program") {
    return "Program";
  }

  return "Blueprint";
};

const createTask = (seed: SummerTaskSeed): Task => ({
  id: `summer-${seed.date}`,
  title: seed.title,
  description: seed.whatToDo,
  category: stageCategory(seed.stage),
  status: "Next Up",
  dueDate: seed.date,
  estimatedTime: "90 minutes",
  stage: seed.stage,
  whatToDo: seed.whatToDo,
  checklist: seed.checklist,
  deliverable: seed.deliverable
});

const summerTaskSeeds: SummerTaskSeed[] = [
  {
    date: "2026-06-21",
    stage: "Blueprint",
    title: "Write the FocusFlow project definition.",
    whatToDo: "Write the mission, problem, target users, and solution in simple language.",
    checklist: ["Write mission", "Write problem", "Write target audience", "Write solution"],
    deliverable: "FocusFlow project overview draft"
  },
  {
    date: "2026-06-22",
    stage: "Blueprint",
    title: "Design the student journey.",
    whatToDo: "Map the path from joining the website to survey, profile, program, tracking, and reflection.",
    checklist: ["Create user flow", "Define each step", "Identify what each page must do"],
    deliverable: "Student journey map"
  },
  {
    date: "2026-06-23",
    stage: "Blueprint",
    title: "Finalize website page structure.",
    whatToDo: "Decide the purpose of Home, Learn, Assessment, Dashboard, Resources, Research, and Contact.",
    checklist: ["List pages", "Write each page purpose", "Write needed features"],
    deliverable: "Website architecture document"
  },
  {
    date: "2026-06-24",
    stage: "Blueprint",
    title: "Define success metrics.",
    whatToDo: "Decide what the project tracks: screen time, stress, planned study time, actual study time, sleep, and challenge completion.",
    checklist: ["Define each metric", "Decide daily vs weekly tracking", "Write why each metric matters"],
    deliverable: "Metrics framework"
  },
  {
    date: "2026-06-25",
    stage: "Blueprint",
    title: "Create Wix build checklist.",
    whatToDo: "Turn the website structure into a checklist of Wix pages and features.",
    checklist: ["Home checklist", "Learn checklist", "Assessment checklist", "Dashboard checklist", "Resources checklist"],
    deliverable: "Wix build checklist"
  },
  {
    date: "2026-06-26",
    stage: "Blueprint",
    title: "Review and clean the blueprint.",
    whatToDo: "Read all blueprint documents and simplify unclear wording.",
    checklist: ["Fix confusing parts", "Remove unnecessary features", "Confirm the build order"],
    deliverable: "Final blueprint v1"
  },
  {
    date: "2026-06-27",
    stage: "Blueprint",
    title: "Enter Stage 1 into FocusFlow OS.",
    whatToDo: "Add completed blueprint tasks, update stage progress, and prepare Stage 2 tasks.",
    checklist: ["Update calendar", "Mark completed tasks", "Add Stage 2 tasks"],
    deliverable: "FocusFlow OS updated"
  },
  {
    date: "2026-06-28",
    stage: "Program",
    title: "Design 7-Day Reset overview.",
    whatToDo: "Write the purpose of the 7-day program and how it helps students reduce unhealthy device use.",
    checklist: ["Write program goal", "Write daily structure", "Write completion rule"],
    deliverable: "7-Day Program overview"
  },
  {
    date: "2026-06-29",
    stage: "Program",
    title: "Write Day 1 and Day 2 challenges.",
    whatToDo: "Day 1 should track current screen habits. Day 2 should reduce passive scrolling.",
    checklist: ["Write Day 1 task", "Write Day 2 task", "Add reflection questions"],
    deliverable: "Day 1–2 program draft"
  },
  {
    date: "2026-06-30",
    stage: "Program",
    title: "Write Day 3 and Day 4 challenges.",
    whatToDo: "Day 3 focuses on no phone before sleep. Day 4 replaces screen time with offline activity.",
    checklist: ["Write Day 3 task", "Write Day 4 task", "Add examples"],
    deliverable: "Day 3–4 program draft"
  },
  {
    date: "2026-07-01",
    stage: "Program",
    title: "Write Day 5 and Day 6 challenges.",
    whatToDo: "Day 5 focuses on study focus blocks. Day 6 focuses on social/offline replacement.",
    checklist: ["Write Day 5 task", "Write Day 6 task", "Add reflection questions"],
    deliverable: "Day 5–6 program draft"
  },
  {
    date: "2026-07-02",
    stage: "Program",
    title: "Write Day 7 reflection and reset plan.",
    whatToDo: "Create the final reflection where students review progress and choose next steps.",
    checklist: ["Write Day 7 task", "Add weekly reflection", "Add next-week plan"],
    deliverable: "Complete 7-day draft"
  },
  {
    date: "2026-07-03",
    stage: "Program",
    title: "Create student workbook outline.",
    whatToDo: "Turn the 7-day program into a student workbook format.",
    checklist: ["Add daily sections", "Add checkboxes", "Add reflection boxes"],
    deliverable: "Workbook outline"
  },
  {
    date: "2026-07-04",
    stage: "Program",
    title: "Review and finalize Program v1.",
    whatToDo: "Check if every daily task is simple, doable, and connected to digital behavior change.",
    checklist: ["Simplify tasks", "Remove unrealistic tasks", "Update FocusFlow OS"],
    deliverable: "Program v1 complete"
  },
  {
    date: "2026-07-05",
    stage: "Survey",
    title: "Draft intake survey.",
    whatToDo: "Create 15–20 questions about screen time, social media, gaming, sleep, study focus, and stress.",
    checklist: ["Write screen-time questions", "Write sleep questions", "Write study questions", "Write stress questions"],
    deliverable: "Intake survey draft"
  },
  {
    date: "2026-07-06",
    stage: "Survey",
    title: "Create daily check-in.",
    whatToDo: "Build short daily questions students answer in under 2 minutes.",
    checklist: ["Screen time question", "Stress score", "Planned study time", "Actual study time", "Challenge completion"],
    deliverable: "Daily check-in form draft"
  },
  {
    date: "2026-07-07",
    stage: "Survey",
    title: "Create weekly reflection.",
    whatToDo: "Write weekly questions about what improved, what failed, and what the student will change next week.",
    checklist: ["Progress question", "Problem question", "Next action question"],
    deliverable: "Weekly reflection draft"
  },
  {
    date: "2026-07-08",
    stage: "Survey",
    title: "Define behavior profiles.",
    whatToDo: "Create profiles: Heavy Scroller, Gaming User, Social Media Overuser, Late-Night User, Balanced User.",
    checklist: ["Define each profile", "Write trigger rules", "Write short descriptions"],
    deliverable: "Profile system draft"
  },
  {
    date: "2026-07-09",
    stage: "Survey",
    title: "Build recommendation rules.",
    whatToDo: "Create IF-THEN rules that connect survey answers to suggested actions.",
    checklist: ["Heavy Scroller rules", "Gaming rules", "Social Media rules", "Late-Night rules"],
    deliverable: "Recommendation logic v1"
  },
  {
    date: "2026-07-10",
    stage: "Survey",
    title: "Create personalized advice.",
    whatToDo: "Write 3–5 practical suggestions for each behavior profile.",
    checklist: ["Advice for each profile", "Easy action steps", "Avoid judgmental wording"],
    deliverable: "Personalized advice library"
  },
  {
    date: "2026-07-11",
    stage: "Survey",
    title: "Review survey system.",
    whatToDo: "Test whether the survey is too long, too vague, or too hard for students.",
    checklist: ["Cut weak questions", "Fix unclear wording", "Update FocusFlow OS"],
    deliverable: "Survey system v1 complete"
  },
  {
    date: "2026-07-12",
    stage: "Wix Website",
    title: "Build Wix Home page.",
    whatToDo: "Create hero section, mission, problem, program overview, and call-to-action.",
    checklist: ["Add title", "Add mission", "Add problem section", "Add CTA button"],
    deliverable: "Home page draft"
  },
  {
    date: "2026-07-13",
    stage: "Wix Website",
    title: "Build Learn page.",
    whatToDo: "Create sections explaining dopamine, focus, attention, and digital habit loops.",
    checklist: ["Dopamine section", "Attention section", "Habit loop section"],
    deliverable: "Learn page draft"
  },
  {
    date: "2026-07-14",
    stage: "Wix Website",
    title: "Build Assessment page.",
    whatToDo: "Add intake survey structure and explain what students receive after completing it.",
    checklist: ["Add survey intro", "Add questions/form placeholder", "Add profile explanation"],
    deliverable: "Assessment page draft"
  },
  {
    date: "2026-07-15",
    stage: "Wix Website",
    title: "Build Program page.",
    whatToDo: "Add the 7-day Digital Reset Program with daily challenge cards.",
    checklist: ["Add Day 1–7 cards", "Add completion explanation", "Add reflection section"],
    deliverable: "Program page draft"
  },
  {
    date: "2026-07-16",
    stage: "Wix Website",
    title: "Build Resources page.",
    whatToDo: "Create space for workbook, guides, articles, videos, and downloads.",
    checklist: ["Student section", "Parent section", "Teacher section"],
    deliverable: "Resources page draft"
  },
  {
    date: "2026-07-17",
    stage: "Wix Website",
    title: "Build Research/About page.",
    whatToDo: "Explain the science behind FocusFlow in simple language.",
    checklist: ["Add neuroscience section", "Add behavior section", "Add project method section"],
    deliverable: "Research/About page draft"
  },
  {
    date: "2026-07-18",
    stage: "Wix Website",
    title: "Review Wix navigation.",
    whatToDo: "Make sure all pages connect properly and the mobile layout is not broken.",
    checklist: ["Test menu", "Test buttons", "Test mobile view"],
    deliverable: "Wix website structure v1"
  },
  {
    date: "2026-07-19",
    stage: "Dashboard",
    title: "Design dashboard layout.",
    whatToDo: "Sketch the dashboard sections: summary cards, line graphs, bar graphs, and recommendations.",
    checklist: ["Summary cards", "Graph tabs", "Recommendation area"],
    deliverable: "Dashboard wireframe"
  },
  {
    date: "2026-07-20",
    stage: "Dashboard",
    title: "Build screen-time tracking section.",
    whatToDo: "Create a line-graph concept for daily screen time.",
    checklist: ["Define input", "Define graph output", "Write explanation text"],
    deliverable: "Screen-time tracker plan"
  },
  {
    date: "2026-07-21",
    stage: "Dashboard",
    title: "Build stress tracking section.",
    whatToDo: "Create a daily stress score graph and explain what it means.",
    checklist: ["Stress input", "Line graph concept", "Student-friendly explanation"],
    deliverable: "Stress tracker plan"
  },
  {
    date: "2026-07-22",
    stage: "Dashboard",
    title: "Build study tracking section.",
    whatToDo: "Compare planned study time vs actual study time using bar graphs.",
    checklist: ["Planned study input", "Actual study input", "Bar graph concept"],
    deliverable: "Study tracker plan"
  },
  {
    date: "2026-07-23",
    stage: "Dashboard",
    title: "Build challenge completion tracker.",
    whatToDo: "Create a progress display showing which challenge days are completed.",
    checklist: ["Completion checkbox", "Progress percentage", "Streak idea"],
    deliverable: "Challenge tracker plan"
  },
  {
    date: "2026-07-24",
    stage: "Dashboard",
    title: "Build recommendation display.",
    whatToDo: "Show student behavior profile and suggested next steps.",
    checklist: ["Profile label", "Advice card", "Next action card"],
    deliverable: "Recommendation dashboard plan"
  },
  {
    date: "2026-07-25",
    stage: "Dashboard",
    title: "Review dashboard system.",
    whatToDo: "Check whether the dashboard is understandable and not too complex.",
    checklist: ["Remove unnecessary metrics", "Simplify graph names", "Update FocusFlow OS"],
    deliverable: "Dashboard design v1 complete"
  },
  {
    date: "2026-07-26",
    stage: "Resources",
    title: "Write article 1.",
    whatToDo: "Write a simple article: Why We Keep Scrolling.",
    checklist: ["Hook", "Dopamine explanation", "Practical takeaway"],
    deliverable: "Article 1 draft"
  },
  {
    date: "2026-07-27",
    stage: "Resources",
    title: "Write article 2.",
    whatToDo: "Write a simple article: How Phones Affect Focus.",
    checklist: ["Explain attention", "Explain distractions", "Give action steps"],
    deliverable: "Article 2 draft"
  },
  {
    date: "2026-07-28",
    stage: "Resources",
    title: "Write article 3.",
    whatToDo: "Write a simple article: Phone Use and Sleep.",
    checklist: ["Explain late-night use", "Explain sleep impact", "Give habit tips"],
    deliverable: "Article 3 draft"
  },
  {
    date: "2026-07-29",
    stage: "Resources",
    title: "Create student guide.",
    whatToDo: "Turn the 7-day program into a student-friendly guide.",
    checklist: ["Add intro", "Add daily tasks", "Add reflection"],
    deliverable: "Student guide draft"
  },
  {
    date: "2026-07-30",
    stage: "Resources",
    title: "Create parent guide.",
    whatToDo: "Write a short guide explaining how parents can support without controlling.",
    checklist: ["Explain purpose", "Add support tips", "Add warning signs"],
    deliverable: "Parent guide draft"
  },
  {
    date: "2026-07-31",
    stage: "Resources",
    title: "Create teacher guide.",
    whatToDo: "Write a guide for teachers and school adults to help run the pilot.",
    checklist: ["Program overview", "Student instructions", "Data collection notes"],
    deliverable: "Teacher guide draft"
  },
  {
    date: "2026-08-01",
    stage: "Resources",
    title: "Start bilingual conversion.",
    whatToDo: "Translate or outline Chinese versions of key pages and resources.",
    checklist: ["Translate homepage basics", "Translate program overview", "Translate survey intro"],
    deliverable: "Bilingual content draft"
  },
  {
    date: "2026-08-02",
    stage: "Testing",
    title: "Test full user journey.",
    whatToDo: "Pretend to be a student and go from Home to Assessment to Program to Dashboard.",
    checklist: ["Test page flow", "Note confusing parts", "Record problems"],
    deliverable: "User journey test notes"
  },
  {
    date: "2026-08-03",
    stage: "Testing",
    title: "Test survey and profile logic.",
    whatToDo: "Try different student answers and check if the profile result makes sense.",
    checklist: ["Heavy Scroller test", "Gaming test", "Social Media test", "Late-Night test"],
    deliverable: "Profile test notes"
  },
  {
    date: "2026-08-04",
    stage: "Testing",
    title: "Test dashboard clarity.",
    whatToDo: "Check if a student can understand the graphs and next steps without explanation.",
    checklist: ["Screen-time graph", "Stress graph", "Study graph", "Recommendation card"],
    deliverable: "Dashboard test notes"
  },
  {
    date: "2026-08-05",
    stage: "Testing",
    title: "Test mobile layout.",
    whatToDo: "Open the website on phone/tablet view and fix layout problems.",
    checklist: ["Header", "Buttons", "Forms", "Cards"],
    deliverable: "Mobile test notes"
  },
  {
    date: "2026-08-06",
    stage: "Testing",
    title: "Collaborator test.",
    whatToDo: "Ask your collaborator or friend to test the website and write feedback.",
    checklist: ["Give testing instructions", "Collect feedback", "Identify top 5 fixes"],
    deliverable: "Feedback list"
  },
  {
    date: "2026-08-07",
    stage: "Testing",
    title: "Fix top problems.",
    whatToDo: "Fix the most important issues from testing.",
    checklist: ["Fix confusing wording", "Fix broken links", "Fix layout problems"],
    deliverable: "Fixed website draft"
  },
  {
    date: "2026-08-08",
    stage: "Testing",
    title: "Review testing stage.",
    whatToDo: "Confirm the website is stable enough for pilot preparation.",
    checklist: ["Update FocusFlow OS", "Mark completed tests", "List remaining risks"],
    deliverable: "Testing complete"
  },
  {
    date: "2026-08-09",
    stage: "Launch Prep",
    title: "Create pilot launch checklist.",
    whatToDo: "List everything needed before real student participation.",
    checklist: ["Website ready", "Survey ready", "Dashboard ready", "Resources ready"],
    deliverable: "Launch checklist"
  },
  {
    date: "2026-08-10",
    stage: "Launch Prep",
    title: "Create participant onboarding message.",
    whatToDo: "Write the message students will receive before joining.",
    checklist: ["Explain project", "Explain what students do", "Explain time commitment"],
    deliverable: "Onboarding message"
  },
  {
    date: "2026-08-11",
    stage: "Launch Prep",
    title: "Create pilot instruction sheet.",
    whatToDo: "Write step-by-step instructions for students.",
    checklist: ["Join website", "Complete survey", "Follow program", "Track data"],
    deliverable: "Student instruction sheet"
  },
  {
    date: "2026-08-12",
    stage: "Launch Prep",
    title: "Create school adult explanation.",
    whatToDo: "Write a short explanation of the program for school adults.",
    checklist: ["Purpose", "Student benefit", "Data collected", "Safety/privacy note"],
    deliverable: "Adult explanation sheet"
  },
  {
    date: "2026-08-13",
    stage: "Launch Prep",
    title: "Create project presentation.",
    whatToDo: "Make a short slide deck explaining problem, solution, website, and pilot plan.",
    checklist: ["Problem", "Solution", "Website demo", "Pilot plan"],
    deliverable: "Launch presentation"
  },
  {
    date: "2026-08-14",
    stage: "Launch Prep",
    title: "Final website audit.",
    whatToDo: "Check every page, button, form, and resource one final time.",
    checklist: ["Home", "Learn", "Assessment", "Program", "Dashboard", "Resources"],
    deliverable: "Final audit notes"
  },
  {
    date: "2026-08-15",
    stage: "Launch Prep",
    title: "Prepare first participant feedback form.",
    whatToDo: "Create a short form students can use to share what was clear, confusing, or helpful.",
    checklist: ["Write clarity question", "Write usefulness question", "Write improvement question"],
    deliverable: "Participant feedback form draft"
  },
  {
    date: "2026-08-16",
    stage: "Launch Prep",
    title: "Prepare simple data review template.",
    whatToDo: "Create a simple table for reviewing screen time, stress, study time, sleep, and challenge completion.",
    checklist: ["Add metric columns", "Add notes column", "Add weekly summary area"],
    deliverable: "Pilot data review template"
  },
  {
    date: "2026-08-17",
    stage: "Launch Prep",
    title: "Review pilot safety notes.",
    whatToDo: "Write simple notes about privacy, voluntary participation, and when students should ask adults for help.",
    checklist: ["Privacy note", "Voluntary participation note", "Support note"],
    deliverable: "Pilot safety notes"
  },
  {
    date: "2026-08-18",
    stage: "Launch Prep",
    title: "Write launch day checklist.",
    whatToDo: "Create the exact list of actions needed on the first day of the pilot.",
    checklist: ["Check website", "Check forms", "Check resource links", "Check onboarding message"],
    deliverable: "Launch day checklist"
  },
  {
    date: "2026-08-19",
    stage: "Launch Prep",
    title: "Practice the project walkthrough.",
    whatToDo: "Practice explaining FocusFlow from the homepage through the program and dashboard.",
    checklist: ["Practice homepage explanation", "Practice assessment explanation", "Practice dashboard explanation"],
    deliverable: "Practice notes"
  },
  {
    date: "2026-08-20",
    stage: "Launch Prep",
    title: "Prepare backup website notes.",
    whatToDo: "Write what to do if a page, form, or dashboard section does not work during the pilot.",
    checklist: ["Page backup plan", "Form backup plan", "Dashboard backup plan"],
    deliverable: "Backup plan notes"
  },
  {
    date: "2026-08-21",
    stage: "Launch Prep",
    title: "Organize final resource folder.",
    whatToDo: "Place guides, forms, presentation files, and notes into one clear folder structure.",
    checklist: ["Create folder structure", "Add guides", "Add forms", "Add presentation"],
    deliverable: "Organized pilot resource folder"
  },
  {
    date: "2026-08-22",
    stage: "Launch Prep",
    title: "Write first-week follow-up plan.",
    whatToDo: "Plan how to check whether students understand the program during the first week.",
    checklist: ["Day 1 check", "Midweek check", "End-week reflection"],
    deliverable: "First-week follow-up plan"
  },
  {
    date: "2026-08-23",
    stage: "Launch Prep",
    title: "Run final collaborator review.",
    whatToDo: "Ask a collaborator to review the website flow, instructions, and launch materials one more time.",
    checklist: ["Share review instructions", "Collect feedback", "Choose final fixes"],
    deliverable: "Final collaborator review notes"
  },
  {
    date: "2026-08-24",
    stage: "Launch Prep",
    title: "Make final launch fixes.",
    whatToDo: "Fix only the most important remaining problems before the pilot-ready check.",
    checklist: ["Fix critical wording", "Fix broken links", "Confirm mobile layout"],
    deliverable: "Final launch fixes complete"
  },
  {
    date: "2026-08-25",
    stage: "Launch Prep",
    title: "Final readiness review.",
    whatToDo: "Confirm FocusFlow is ready for Grade 10 pilot launch.",
    checklist: ["Website ready", "Program ready", "Survey ready", "Dashboard ready", "Materials ready"],
    deliverable: "Grade 10 pilot-ready system"
  }
];

export const summerBuildTasks: Task[] = summerTaskSeeds.map(createTask);

export const getSummerBuildTaskIds = () => new Set(summerBuildTasks.map((task) => task.id));
