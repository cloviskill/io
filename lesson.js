const STORAGE_KEY = "terrapulse_state_v3";
const TOTAL_LESSONS = 20;
const CHAPTER_SIZE = 10;

const lessonNumber = Number(document.body.dataset.lessonNumber || "1");
const chapterNumber = Math.ceil(lessonNumber / CHAPTER_SIZE);
const chapterLessonNumber = ((lessonNumber - 1) % CHAPTER_SIZE) + 1;
const progressLabel = document.getElementById("lesson-progress-label");
const nextLabel = document.getElementById("lesson-next-label");
const status = document.getElementById("status");
const completeButton = document.getElementById("complete-button");

let state = {};

try {
  state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
} catch {
  state = {};
}

if (state.theme) {
  document.body.dataset.theme = state.theme;
}

if (progressLabel) {
  progressLabel.textContent = `${chapterLessonNumber}/${CHAPTER_SIZE}`;
}

if (nextLabel) {
  nextLabel.textContent =
    lessonNumber >= TOTAL_LESSONS
      ? "Parcours complet"
      : chapterLessonNumber >= CHAPTER_SIZE
        ? `Chapitre ${chapterNumber + 1}`
        : `Suite: mission ${chapterLessonNumber + 1}`;
}

if ((state.completedLessons || 0) >= lessonNumber) {
  completeButton.textContent = "Mission validee";
  status.textContent =
    lessonNumber >= TOTAL_LESSONS
      ? "Parcours deja termine."
      : chapterLessonNumber >= CHAPTER_SIZE
        ? "Fin de chapitre deja validee."
        : "Cette mission est deja debloquee.";
}

completeButton.addEventListener("click", () => {
  let currentState = {};

  try {
    currentState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    currentState = {};
  }

  currentState.completedLessons = Math.max(currentState.completedLessons || 0, lessonNumber);
  currentState.lessonChapter = Math.min(
    Math.floor(Math.min(currentState.completedLessons, TOTAL_LESSONS - 1) / CHAPTER_SIZE),
    Math.floor((TOTAL_LESSONS - 1) / CHAPTER_SIZE)
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));

  completeButton.textContent = "Mission validee";
  status.textContent =
    lessonNumber >= TOTAL_LESSONS
      ? "Mission 10 experte validee. Le parcours est termine."
      : chapterLessonNumber >= CHAPTER_SIZE
        ? `Chapitre ${chapterNumber} valide. Le suivant est pret.`
        : `Mission ${chapterLessonNumber} validee. La suivante est prete.`;
});
