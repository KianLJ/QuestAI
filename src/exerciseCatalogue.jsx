// ---- Workout catalogue ----
const MUSCLE_GROUPS = [
  "chest", "back", "shoulders", "biceps", "triceps", "quads", "hamstrings",
  "glutes", "calves", "abs", "forearms", "traps", "cardio",
];
const MUSCLE_LABELS = {
  chest: "Chest", back: "Back", shoulders: "Shoulders", biceps: "Biceps", triceps: "Triceps",
  quads: "Quads", hamstrings: "Hamstrings", glutes: "Glutes", calves: "Calves", abs: "Abs",
  forearms: "Forearms", traps: "Traps", cardio: "Cardio",
};
const EQUIPMENT_TYPES = [
  "barbell", "dumbbell", "machine", "cable", "bodyweight", "kettlebell", "band", "smith", "bench",
];
const EQUIPMENT_LABELS = {
  barbell: "Barbell", dumbbell: "Dumbbell", machine: "Machine", cable: "Cable", bodyweight: "Bodyweight",
  kettlebell: "Kettlebell", band: "Band", smith: "Smith Machine", bench: "Bench",
};

const EXERCISE_CATALOGUE = [
  // ===== CHEST =====
  { id: "bb-bench-press",        name: "Barbell Bench Press",           equipment: "barbell",    primaryMuscle: "chest", muscleGroups: ["chest", "triceps", "shoulders"], category: "push" },
  { id: "bb-incline-bench",      name: "Incline Barbell Bench Press",   equipment: "barbell",    primaryMuscle: "chest", muscleGroups: ["chest", "shoulders", "triceps"], category: "push" },
  { id: "bb-decline-bench",      name: "Decline Barbell Bench Press",   equipment: "barbell",    primaryMuscle: "chest", muscleGroups: ["chest", "triceps"], category: "push" },
  { id: "smith-bench-press",     name: "Smith Machine Bench Press",     equipment: "smith",      primaryMuscle: "chest", muscleGroups: ["chest", "triceps", "shoulders"], category: "push" },
  { id: "db-bench-press",        name: "Dumbbell Bench Press",          equipment: "dumbbell", bilateral: true,   primaryMuscle: "chest", muscleGroups: ["chest", "triceps", "shoulders"], category: "push" },
  { id: "db-incline-press",      name: "Incline Dumbbell Press",        equipment: "dumbbell", bilateral: true,   primaryMuscle: "chest", muscleGroups: ["chest", "shoulders", "triceps"], category: "push" },
  { id: "db-decline-press",      name: "Decline Dumbbell Press",        equipment: "dumbbell", bilateral: true,   primaryMuscle: "chest", muscleGroups: ["chest", "triceps"], category: "push" },
  { id: "db-flyes",              name: "Dumbbell Flyes",                equipment: "dumbbell", bilateral: true,   primaryMuscle: "chest", muscleGroups: ["chest"], category: "push" },
  { id: "db-incline-flyes",      name: "Incline Dumbbell Flyes",        equipment: "dumbbell", bilateral: true,   primaryMuscle: "chest", muscleGroups: ["chest", "shoulders"], category: "push" },
  { id: "cable-crossover",       name: "Cable Crossover",               equipment: "cable",      primaryMuscle: "chest", muscleGroups: ["chest"], category: "push" },
  { id: "cable-low-high-fly",    name: "Low-to-High Cable Fly",         equipment: "cable",      primaryMuscle: "chest", muscleGroups: ["chest", "shoulders"], category: "push" },
  { id: "machine-chest-press",   name: "Machine Chest Press",           equipment: "machine",    primaryMuscle: "chest", muscleGroups: ["chest", "triceps"], category: "push" },
  { id: "pec-deck",              name: "Pec Deck Machine",              equipment: "machine",    primaryMuscle: "chest", muscleGroups: ["chest"], category: "push" },
  { id: "push-up",               name: "Push-Up",                       equipment: "bodyweight", primaryMuscle: "chest", muscleGroups: ["chest", "triceps", "shoulders", "abs"], category: "push" },
  { id: "incline-push-up",       name: "Incline Push-Up",               equipment: "bodyweight", primaryMuscle: "chest", muscleGroups: ["chest", "shoulders"], category: "push" },
  { id: "decline-push-up",       name: "Decline Push-Up",               equipment: "bodyweight", primaryMuscle: "chest", muscleGroups: ["chest", "shoulders", "triceps"], category: "push" },
  { id: "chest-dip",             name: "Chest Dip",                     equipment: "bodyweight", primaryMuscle: "chest", muscleGroups: ["chest", "triceps"], category: "push" },
  { id: "landmine-press",        name: "Landmine Press",                equipment: "barbell",    primaryMuscle: "chest", muscleGroups: ["chest", "shoulders", "triceps"], category: "push" },

  // ===== BACK =====
  { id: "bb-deadlift",           name: "Barbell Deadlift",              equipment: "barbell",    primaryMuscle: "back", muscleGroups: ["back", "hamstrings", "glutes", "forearms", "traps"], category: "pull" },
  { id: "bb-sumo-deadlift",      name: "Sumo Deadlift",                 equipment: "barbell",    primaryMuscle: "back", muscleGroups: ["back", "glutes", "hamstrings", "quads"], category: "pull" },
  { id: "bb-rack-pull",          name: "Rack Pull",                     equipment: "barbell",    primaryMuscle: "back", muscleGroups: ["back", "traps", "forearms"], category: "pull" },
  { id: "pull-up",               name: "Pull-Up",                       equipment: "bodyweight", primaryMuscle: "back", muscleGroups: ["back", "biceps", "forearms"], category: "pull" },
  { id: "chin-up",               name: "Chin-Up",                       equipment: "bodyweight", primaryMuscle: "back", muscleGroups: ["back", "biceps"], category: "pull" },
  { id: "inverted-row",          name: "Inverted Row",                  equipment: "bodyweight", primaryMuscle: "back", muscleGroups: ["back", "biceps"], category: "pull" },
  { id: "lat-pulldown",          name: "Lat Pulldown",                  equipment: "cable",      primaryMuscle: "back", muscleGroups: ["back", "biceps"], category: "pull" },
  { id: "lat-pulldown-single",   name: "Single-Arm Lat Pulldown",       equipment: "cable",      primaryMuscle: "back", muscleGroups: ["back", "biceps"], category: "pull" },
  { id: "seated-cable-row",      name: "Seated Cable Row",              equipment: "cable",      primaryMuscle: "back", muscleGroups: ["back", "biceps"], category: "pull" },
  { id: "straight-arm-pulldown", name: "Straight-Arm Pulldown",         equipment: "cable",      primaryMuscle: "back", muscleGroups: ["back", "triceps"], category: "pull" },
  { id: "face-pull",             name: "Face Pull",                     equipment: "cable",      primaryMuscle: "shoulders", muscleGroups: ["shoulders", "back", "traps"], category: "pull" },
  { id: "bb-bent-over-row",      name: "Bent-Over Barbell Row",         equipment: "barbell",    primaryMuscle: "back", muscleGroups: ["back", "biceps"], category: "pull" },
  { id: "bb-pendlay-row",        name: "Pendlay Row",                   equipment: "barbell",    primaryMuscle: "back", muscleGroups: ["back", "biceps"], category: "pull" },
  { id: "t-bar-row",             name: "T-Bar Row",                     equipment: "barbell",    primaryMuscle: "back", muscleGroups: ["back", "biceps"], category: "pull" },
  { id: "db-one-arm-row",        name: "One-Arm Dumbbell Row",          equipment: "dumbbell",   primaryMuscle: "back", muscleGroups: ["back", "biceps"], category: "pull" },
  { id: "machine-row",           name: "Machine Row",                   equipment: "machine",    primaryMuscle: "back", muscleGroups: ["back", "biceps"], category: "pull" },
  { id: "band-pull-apart",       name: "Band Pull-Apart",               equipment: "band",       primaryMuscle: "back", muscleGroups: ["back", "shoulders"], category: "pull" },
  { id: "bb-good-morning",       name: "Good Morning",                  equipment: "barbell",    primaryMuscle: "hamstrings", muscleGroups: ["hamstrings", "back", "glutes"], category: "pull" },

  // ===== SHOULDERS =====
  { id: "bb-overhead-press",     name: "Barbell Overhead Press",        equipment: "barbell",    primaryMuscle: "shoulders", muscleGroups: ["shoulders", "triceps"], category: "push" },
  { id: "db-shoulder-press",     name: "Seated Dumbbell Shoulder Press",equipment: "dumbbell", bilateral: true,   primaryMuscle: "shoulders", muscleGroups: ["shoulders", "triceps"], category: "push" },
  { id: "db-arnold-press",       name: "Arnold Press",                  equipment: "dumbbell", bilateral: true,   primaryMuscle: "shoulders", muscleGroups: ["shoulders", "triceps"], category: "push" },
  { id: "machine-shoulder-press",name: "Machine Shoulder Press",        equipment: "machine",    primaryMuscle: "shoulders", muscleGroups: ["shoulders", "triceps"], category: "push" },
  { id: "smith-overhead-press",  name: "Smith Machine Overhead Press",  equipment: "smith",      primaryMuscle: "shoulders", muscleGroups: ["shoulders", "triceps"], category: "push" },
  { id: "db-lateral-raise",      name: "Dumbbell Lateral Raise",        equipment: "dumbbell", bilateral: true,   primaryMuscle: "shoulders", muscleGroups: ["shoulders"], category: "push" },
  { id: "cable-lateral-raise",   name: "Cable Lateral Raise",           equipment: "cable",      primaryMuscle: "shoulders", muscleGroups: ["shoulders"], category: "push" },
  { id: "band-lateral-raise",    name: "Band Lateral Raise",            equipment: "band",       primaryMuscle: "shoulders", muscleGroups: ["shoulders"], category: "push" },
  { id: "db-front-raise",        name: "Dumbbell Front Raise",          equipment: "dumbbell", bilateral: true,   primaryMuscle: "shoulders", muscleGroups: ["shoulders"], category: "push" },
  { id: "db-rear-delt-fly",      name: "Dumbbell Rear Delt Fly",        equipment: "dumbbell", bilateral: true,   primaryMuscle: "shoulders", muscleGroups: ["shoulders", "back"], category: "pull" },
  { id: "cable-rear-delt-fly",   name: "Cable Rear Delt Fly",           equipment: "cable",      primaryMuscle: "shoulders", muscleGroups: ["shoulders", "back"], category: "pull" },
  { id: "bb-upright-row",        name: "Barbell Upright Row",           equipment: "barbell",    primaryMuscle: "shoulders", muscleGroups: ["shoulders", "traps"], category: "pull" },
  { id: "cable-upright-row",     name: "Cable Upright Row",             equipment: "cable",      primaryMuscle: "shoulders", muscleGroups: ["shoulders", "traps"], category: "pull" },
  { id: "landmine-lateral-raise",name: "Landmine Lateral Raise",        equipment: "barbell",    primaryMuscle: "shoulders", muscleGroups: ["shoulders"], category: "push" },
  { id: "kb-overhead-press",     name: "Kettlebell Overhead Press",     equipment: "kettlebell", primaryMuscle: "shoulders", muscleGroups: ["shoulders", "triceps"], category: "push" },

  // ===== BICEPS =====
  { id: "bb-curl",               name: "Barbell Curl",                  equipment: "barbell",    primaryMuscle: "biceps", muscleGroups: ["biceps", "forearms"], category: "pull" },
  { id: "ez-curl",               name: "EZ-Bar Curl",                   equipment: "barbell",    primaryMuscle: "biceps", muscleGroups: ["biceps", "forearms"], category: "pull" },
  { id: "db-curl",               name: "Dumbbell Curl",                 equipment: "dumbbell", bilateral: true,   primaryMuscle: "biceps", muscleGroups: ["biceps", "forearms"], category: "pull" },
  { id: "db-hammer-curl",        name: "Hammer Curl",                   equipment: "dumbbell", bilateral: true,   primaryMuscle: "biceps", muscleGroups: ["biceps", "forearms"], category: "pull" },
  { id: "db-incline-curl",       name: "Incline Dumbbell Curl",         equipment: "dumbbell", bilateral: true,   primaryMuscle: "biceps", muscleGroups: ["biceps"], category: "pull" },
  { id: "db-concentration-curl", name: "Concentration Curl",            equipment: "dumbbell",   primaryMuscle: "biceps", muscleGroups: ["biceps"], category: "pull" },
  { id: "cable-curl",            name: "Cable Curl",                    equipment: "cable",      primaryMuscle: "biceps", muscleGroups: ["biceps"], category: "pull" },
  { id: "preacher-curl",         name: "Preacher Curl",                 equipment: "machine",    primaryMuscle: "biceps", muscleGroups: ["biceps"], category: "pull" },
  { id: "machine-bicep-curl",    name: "Machine Bicep Curl",            equipment: "machine",    primaryMuscle: "biceps", muscleGroups: ["biceps"], category: "pull" },
  { id: "band-curl",             name: "Band Curl",                     equipment: "band",       primaryMuscle: "biceps", muscleGroups: ["biceps"], category: "pull" },
  { id: "kb-curl",                name: "Kettlebell Curl",              equipment: "kettlebell", primaryMuscle: "biceps", muscleGroups: ["biceps", "forearms"], category: "pull" },

  // ===== TRICEPS =====
  { id: "bb-close-grip-bench",   name: "Close-Grip Bench Press",        equipment: "barbell",    primaryMuscle: "triceps", muscleGroups: ["triceps", "chest"], category: "push" },
  { id: "cable-triceps-pushdown",name: "Triceps Pushdown",              equipment: "cable",      primaryMuscle: "triceps", muscleGroups: ["triceps"], category: "push" },
  { id: "cable-overhead-ext",    name: "Cable Overhead Triceps Extension", equipment: "cable",   primaryMuscle: "triceps", muscleGroups: ["triceps"], category: "push" },
  { id: "db-overhead-ext",       name: "Dumbbell Overhead Triceps Extension", equipment: "dumbbell", primaryMuscle: "triceps", muscleGroups: ["triceps"], category: "push" },
  { id: "ez-skull-crusher",      name: "EZ-Bar Skull Crusher",          equipment: "barbell",    primaryMuscle: "triceps", muscleGroups: ["triceps"], category: "push" },
  { id: "triceps-dip",           name: "Triceps Dip",                   equipment: "bodyweight", primaryMuscle: "triceps", muscleGroups: ["triceps", "chest"], category: "push" },
  { id: "db-kickback",           name: "Dumbbell Kickback",             equipment: "dumbbell",   primaryMuscle: "triceps", muscleGroups: ["triceps"], category: "push" },
  { id: "machine-triceps-ext",   name: "Machine Triceps Extension",     equipment: "machine",    primaryMuscle: "triceps", muscleGroups: ["triceps"], category: "push" },
  { id: "band-triceps-pushdown", name: "Band Triceps Pushdown",         equipment: "band",       primaryMuscle: "triceps", muscleGroups: ["triceps"], category: "push" },
  { id: "bench-dip",             name: "Bench Dip",                     equipment: "bench",      primaryMuscle: "triceps", muscleGroups: ["triceps", "chest"], category: "push" },

  // ===== QUADS =====
  { id: "bb-back-squat",         name: "Barbell Back Squat",            equipment: "barbell",    primaryMuscle: "quads", muscleGroups: ["quads", "glutes", "hamstrings"], category: "legs" },
  { id: "bb-front-squat",        name: "Barbell Front Squat",           equipment: "barbell",    primaryMuscle: "quads", muscleGroups: ["quads", "glutes", "abs"], category: "legs" },
  { id: "smith-squat",           name: "Smith Machine Squat",           equipment: "smith",      primaryMuscle: "quads", muscleGroups: ["quads", "glutes"], category: "legs" },
  { id: "leg-press",             name: "Leg Press",                     equipment: "machine",    primaryMuscle: "quads", muscleGroups: ["quads", "glutes", "hamstrings"], category: "legs" },
  { id: "hack-squat",            name: "Hack Squat",                    equipment: "machine",    primaryMuscle: "quads", muscleGroups: ["quads", "glutes"], category: "legs" },
  { id: "leg-extension",         name: "Leg Extension",                 equipment: "machine",    primaryMuscle: "quads", muscleGroups: ["quads"], category: "legs" },
  { id: "db-goblet-squat",       name: "Goblet Squat",                  equipment: "dumbbell",   primaryMuscle: "quads", muscleGroups: ["quads", "glutes"], category: "legs" },
  { id: "kb-goblet-squat",       name: "Kettlebell Goblet Squat",       equipment: "kettlebell", primaryMuscle: "quads", muscleGroups: ["quads", "glutes"], category: "legs" },
  { id: "db-bulgarian-split",    name: "Bulgarian Split Squat",         equipment: "dumbbell", bilateral: true,   primaryMuscle: "quads", muscleGroups: ["quads", "glutes"], category: "legs" },
  { id: "db-walking-lunge",      name: "Walking Lunge",                 equipment: "dumbbell", bilateral: true,   primaryMuscle: "quads", muscleGroups: ["quads", "glutes", "hamstrings"], category: "legs" },
  { id: "bb-walking-lunge",      name: "Barbell Walking Lunge",         equipment: "barbell",    primaryMuscle: "quads", muscleGroups: ["quads", "glutes"], category: "legs" },
  { id: "db-step-up",            name: "Dumbbell Step-Up",              equipment: "dumbbell", bilateral: true,   primaryMuscle: "quads", muscleGroups: ["quads", "glutes"], category: "legs" },
  { id: "bodyweight-squat",      name: "Bodyweight Squat",              equipment: "bodyweight", primaryMuscle: "quads", muscleGroups: ["quads", "glutes"], category: "legs" },
  { id: "bodyweight-lunge",      name: "Bodyweight Lunge",              equipment: "bodyweight", primaryMuscle: "quads", muscleGroups: ["quads", "glutes"], category: "legs" },

  // ===== HAMSTRINGS =====
  { id: "bb-romanian-deadlift",  name: "Romanian Deadlift",             equipment: "barbell",    primaryMuscle: "hamstrings", muscleGroups: ["hamstrings", "glutes", "back"], category: "legs" },
  { id: "db-stiff-leg-deadlift", name: "Dumbbell Stiff-Leg Deadlift",   equipment: "dumbbell", bilateral: true,   primaryMuscle: "hamstrings", muscleGroups: ["hamstrings", "glutes"], category: "legs" },
  { id: "db-single-leg-rdl",     name: "Single-Leg Romanian Deadlift",  equipment: "dumbbell",   primaryMuscle: "hamstrings", muscleGroups: ["hamstrings", "glutes"], category: "legs" },
  { id: "lying-leg-curl",        name: "Lying Leg Curl",                equipment: "machine",    primaryMuscle: "hamstrings", muscleGroups: ["hamstrings"], category: "legs" },
  { id: "seated-leg-curl",       name: "Seated Leg Curl",               equipment: "machine",    primaryMuscle: "hamstrings", muscleGroups: ["hamstrings"], category: "legs" },
  { id: "cable-pull-through",    name: "Cable Pull-Through",            equipment: "cable",      primaryMuscle: "hamstrings", muscleGroups: ["hamstrings", "glutes"], category: "legs" },
  { id: "nordic-curl",           name: "Nordic Curl",                   equipment: "bodyweight", primaryMuscle: "hamstrings", muscleGroups: ["hamstrings"], category: "legs" },
  { id: "kb-swing",              name: "Kettlebell Swing",              equipment: "kettlebell", primaryMuscle: "hamstrings", muscleGroups: ["hamstrings", "glutes", "back"], category: "legs" },

  // ===== GLUTES =====
  { id: "bb-hip-thrust",         name: "Barbell Hip Thrust",            equipment: "barbell",    primaryMuscle: "glutes", muscleGroups: ["glutes", "hamstrings"], category: "legs" },
  { id: "bodyweight-glute-bridge",name: "Glute Bridge",                 equipment: "bodyweight", primaryMuscle: "glutes", muscleGroups: ["glutes", "hamstrings"], category: "legs" },
  { id: "band-hip-thrust",       name: "Band Hip Thrust",               equipment: "band",       primaryMuscle: "glutes", muscleGroups: ["glutes"], category: "legs" },
  { id: "cable-glute-kickback",  name: "Cable Glute Kickback",          equipment: "cable",      primaryMuscle: "glutes", muscleGroups: ["glutes"], category: "legs" },
  { id: "machine-hip-abduction", name: "Hip Abduction Machine",         equipment: "machine",    primaryMuscle: "glutes", muscleGroups: ["glutes"], category: "legs" },
  { id: "machine-glute-kickback",name: "Glute Kickback Machine",        equipment: "machine",    primaryMuscle: "glutes", muscleGroups: ["glutes"], category: "legs" },

  // ===== CALVES =====
  { id: "standing-calf-raise",   name: "Standing Calf Raise",           equipment: "machine",    primaryMuscle: "calves", muscleGroups: ["calves"], category: "legs" },
  { id: "seated-calf-raise",     name: "Seated Calf Raise",             equipment: "machine",    primaryMuscle: "calves", muscleGroups: ["calves"], category: "legs" },
  { id: "db-calf-raise",         name: "Dumbbell Calf Raise",           equipment: "dumbbell", bilateral: true,   primaryMuscle: "calves", muscleGroups: ["calves"], category: "legs" },
  { id: "leg-press-calf-raise",  name: "Leg Press Calf Raise",          equipment: "machine",    primaryMuscle: "calves", muscleGroups: ["calves"], category: "legs" },
  { id: "bodyweight-calf-raise", name: "Bodyweight Calf Raise",         equipment: "bodyweight", primaryMuscle: "calves", muscleGroups: ["calves"], category: "legs" },

  // ===== ABS / CORE =====
  { id: "plank",                 name: "Plank",                         equipment: "bodyweight", timed: true, primaryMuscle: "abs", muscleGroups: ["abs"], category: "core" },
  { id: "side-plank",            name: "Side Plank",                    equipment: "bodyweight", timed: true, primaryMuscle: "abs", muscleGroups: ["abs"], category: "core" },
  { id: "hanging-leg-raise",     name: "Hanging Leg Raise",             equipment: "bodyweight", primaryMuscle: "abs", muscleGroups: ["abs", "forearms"], category: "core" },
  { id: "sit-up",                name: "Sit-Up",                        equipment: "bodyweight", primaryMuscle: "abs", muscleGroups: ["abs"], category: "core" },
  { id: "crunch",                name: "Crunch",                        equipment: "bodyweight", primaryMuscle: "abs", muscleGroups: ["abs"], category: "core" },
  { id: "decline-sit-up",        name: "Decline Sit-Up",                equipment: "bench",      primaryMuscle: "abs", muscleGroups: ["abs"], category: "core" },
  { id: "cable-crunch",          name: "Cable Crunch",                  equipment: "cable",      primaryMuscle: "abs", muscleGroups: ["abs"], category: "core" },
  { id: "machine-crunch",        name: "Machine Crunch",                equipment: "machine",    primaryMuscle: "abs", muscleGroups: ["abs"], category: "core" },
  { id: "ab-wheel-rollout",      name: "Ab Wheel Rollout",              equipment: "bodyweight", primaryMuscle: "abs", muscleGroups: ["abs", "shoulders"], category: "core" },
  { id: "cable-woodchopper",     name: "Cable Woodchopper",             equipment: "cable",      primaryMuscle: "abs", muscleGroups: ["abs"], category: "core" },
  { id: "russian-twist",         name: "Russian Twist",                 equipment: "dumbbell",   primaryMuscle: "abs", muscleGroups: ["abs"], category: "core" },
  { id: "mountain-climbers",     name: "Mountain Climbers",             equipment: "bodyweight", primaryMuscle: "abs", muscleGroups: ["abs", "cardio"], category: "core" },
  { id: "kb-windmill",           name: "Kettlebell Windmill",           equipment: "kettlebell", primaryMuscle: "abs", muscleGroups: ["abs", "shoulders"], category: "core" },

  // ===== FOREARMS =====
  { id: "bb-wrist-curl",         name: "Barbell Wrist Curl",            equipment: "barbell",    primaryMuscle: "forearms", muscleGroups: ["forearms"], category: "pull" },
  { id: "db-wrist-curl",         name: "Dumbbell Wrist Curl",           equipment: "dumbbell", bilateral: true,   primaryMuscle: "forearms", muscleGroups: ["forearms"], category: "pull" },
  { id: "bb-reverse-curl",       name: "Barbell Reverse Curl",          equipment: "barbell",    primaryMuscle: "forearms", muscleGroups: ["forearms", "biceps"], category: "pull" },
  { id: "farmers-carry",         name: "Farmer's Carry",                equipment: "dumbbell", bilateral: true,   primaryMuscle: "forearms", muscleGroups: ["forearms", "traps", "abs"], category: "pull" },
  { id: "kb-farmers-carry",      name: "Kettlebell Farmer's Carry",     equipment: "kettlebell", primaryMuscle: "forearms", muscleGroups: ["forearms", "traps", "abs"], category: "pull" },
  { id: "plate-pinch-hold",      name: "Plate Pinch Hold",              equipment: "bodyweight", timed: true, primaryMuscle: "forearms", muscleGroups: ["forearms"], category: "pull" },

  // ===== TRAPS =====
  { id: "bb-shrug",              name: "Barbell Shrug",                 equipment: "barbell",    primaryMuscle: "traps", muscleGroups: ["traps"], category: "pull" },
  { id: "db-shrug",              name: "Dumbbell Shrug",                equipment: "dumbbell", bilateral: true,   primaryMuscle: "traps", muscleGroups: ["traps"], category: "pull" },
  { id: "cable-shrug",           name: "Cable Shrug",                   equipment: "cable",      primaryMuscle: "traps", muscleGroups: ["traps"], category: "pull" },
  { id: "smith-shrug",           name: "Smith Machine Shrug",           equipment: "smith",      primaryMuscle: "traps", muscleGroups: ["traps"], category: "pull" },

  // ===== CARDIO =====
  { id: "treadmill-run",         name: "Treadmill Run",                 equipment: "machine",    primaryMuscle: "cardio", muscleGroups: ["cardio", "quads", "calves"], category: "cardio" },
  { id: "rowing-machine",        name: "Rowing Machine",                equipment: "machine",    primaryMuscle: "cardio", muscleGroups: ["cardio", "back", "hamstrings"], category: "cardio" },
  { id: "stationary-bike",       name: "Stationary Bike",               equipment: "machine",    primaryMuscle: "cardio", muscleGroups: ["cardio", "quads"], category: "cardio" },
  { id: "stair-climber",         name: "Stair Climber",                 equipment: "machine",    primaryMuscle: "cardio", muscleGroups: ["cardio", "quads", "glutes"], category: "cardio" },
  { id: "elliptical",            name: "Elliptical",                    equipment: "machine",    primaryMuscle: "cardio", muscleGroups: ["cardio"], category: "cardio" },
  { id: "jump-rope",             name: "Jump Rope",                     equipment: "bodyweight", primaryMuscle: "cardio", muscleGroups: ["cardio", "calves"], category: "cardio" },
  { id: "battle-ropes",          name: "Battle Ropes",                  equipment: "bodyweight", primaryMuscle: "cardio", muscleGroups: ["cardio", "shoulders", "abs"], category: "cardio" },
  { id: "sled-push",             name: "Sled Push",                     equipment: "machine",    primaryMuscle: "cardio", muscleGroups: ["cardio", "quads", "glutes"], category: "cardio" },
  { id: "burpees",               name: "Burpees",                       equipment: "bodyweight", primaryMuscle: "cardio", muscleGroups: ["cardio", "chest", "quads", "abs"], category: "cardio" },
  { id: "kb-swing-cardio",       name: "Kettlebell Swing (Cardio Pace)",equipment: "kettlebell", primaryMuscle: "cardio", muscleGroups: ["cardio", "hamstrings", "glutes"], category: "cardio" },
];

function findExercise(id, customExercises = []) {
  return EXERCISE_CATALOGUE.find((e) => e.id === id) || customExercises.find((e) => e.id === id) || null;
}

// Tally set volume per muscle group for a plan's exercise list.
// Primary muscle gets full credit per set; secondary muscles get half credit.
function summarizeMuscleVolume(planExercises, customExercises = []) {
  const tally = {};
  for (const pe of planExercises) {
    const ex = findExercise(pe.exerciseId, customExercises);
    if (!ex) continue;
    const sets = pe.sets || 0;
    for (const muscle of ex.muscleGroups) {
      const weight = muscle === ex.primaryMuscle ? 1 : 0.5;
      tally[muscle] = (tally[muscle] || 0) + sets * weight;
    }
  }
  return Object.entries(tally)
    .map(([muscle, volume]) => ({ muscle, volume: Math.round(volume * 10) / 10 }))
    .sort((a, b) => b.volume - a.volume);
}

export {
  MUSCLE_GROUPS, MUSCLE_LABELS, EQUIPMENT_TYPES, EQUIPMENT_LABELS,
  EXERCISE_CATALOGUE, findExercise, summarizeMuscleVolume,
};
