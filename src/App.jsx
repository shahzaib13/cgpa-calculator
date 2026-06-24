import { useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Heart, Plus, Sparkles, Trash2 } from "lucide-react";
import CustomCursor from "./components/CustomCursor";
import FloatingBackground from "./components/FloatingBackground";
import { getRoastMessage } from "./roastMessages";

const DEFAULT_SUBJECT_DATA = [
  { name: "Software Engineering", credits: 3 },
  { name: "Computer Networking", credits: 3 },
  { name: "Entrepreneurship", credits: 3 },
  { name: "COAL", credits: 3 },
  { name: "Web Technologies", credits: 3 },
  { name: "Ideology and Constitution of Pakistan", credits: 2 },
];

function createSubject(name, credits) {
  return {
    id: crypto.randomUUID(),
    name,
    credits,
    gpa: "",
  };
}

const DEFAULT_SUBJECTS = DEFAULT_SUBJECT_DATA.map(({ name, credits }) =>
  createSubject(name, credits)
);

function sanitizeGpaInput(raw) {
  if (raw === "") return "";

  let value = raw.replace(/[^0-9.]/g, "");

  const dotIndex = value.indexOf(".");
  if (dotIndex !== -1) {
    value =
      value.slice(0, dotIndex + 1) +
      value.slice(dotIndex + 1).replace(/\./g, "");
  }

  if (value === ".") return "0.";

  const parts = value.split(".");
  if (parts[1]?.length > 1) {
    value = `${parts[0]}.${parts[1].slice(0, 1)}`;
  }

  const numeric = parseFloat(value);
  if (!Number.isNaN(numeric) && numeric > 4) return "4";
  if (value.startsWith("4") && value.length > 1 && value[1] !== ".") return "4";

  return value;
}

function parseGpa(value) {
  if (value === "" || value === ".") return null;
  const numeric = parseFloat(value);
  if (Number.isNaN(numeric) || numeric < 0 || numeric > 4) return null;
  return numeric;
}

function parseCredits(value) {
  const numeric = parseInt(String(value), 10);
  if (Number.isNaN(numeric) || numeric < 1) return null;
  return numeric;
}

function findFirstInvalidField(subjects) {
  for (const subject of subjects) {
    if (!subject.name.trim()) {
      return { id: subject.id, field: "name", message: "Please fill this field" };
    }
    if (parseCredits(subject.credits) === null) {
      return { id: subject.id, field: "credits", message: "Please fill this field" };
    }
    if (parseGpa(subject.gpa) === null) {
      return { id: subject.id, field: "gpa", message: "Please fill this field" };
    }
  }
  return null;
}

function calculateSgpa(subjects) {
  let totalGradePoints = 0;
  let credits = 0;
  let count = 0;

  for (const subject of subjects) {
    const gpa = parseGpa(subject.gpa);
    const subjectCredits = parseCredits(subject.credits);

    if (gpa !== null && subjectCredits !== null) {
      totalGradePoints += gpa * subjectCredits;
      credits += subjectCredits;
      count += 1;
    }
  }

  return {
    sgpa: credits > 0 ? totalGradePoints / credits : null,
    totalCredits: credits,
    contributingCount: count,
  };
}

function fireConfetti() {
  const duration = 2200;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ["#6366f1", "#8b5cf6", "#a78bfa", "#f472b6", "#38bdf8"],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ["#6366f1", "#8b5cf6", "#a78bfa", "#f472b6", "#38bdf8"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  confetti({
    particleCount: 100,
    spread: 80,
    origin: { y: 0.55 },
    colors: ["#6366f1", "#8b5cf6", "#c4b5fd", "#f9a8d4", "#7dd3fc"],
  });

  frame();
}

export default function App() {
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [resultRevealed, setResultRevealed] = useState(false);
  const [generateShake, setGenerateShake] = useState(false);
  const [fieldError, setFieldError] = useState(null);
  const resultRef = useRef(null);
  const fieldRefs = useRef({});
  const recentRoastsRef = useRef([]);

  function invalidateResult() {
    setGeneratedResult(null);
    setResultRevealed(false);
    recentRoastsRef.current = [];
  }

  function setFieldRef(id, field, el) {
    if (el) fieldRefs.current[`${id}-${field}`] = el;
  }

  function focusField(id, field) {
    const el = fieldRefs.current[`${id}-${field}`];
    if (!el) return;
    el.focus({ preventScroll: true });
    el.select();
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function handleInputFocus(e) {
    const input = e.target;
    requestAnimationFrame(() => input.select());
  }

  function handleFieldKeyDown(e, subjectId, field) {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const index = subjects.findIndex((s) => s.id === subjectId);
    if (index === -1) return;

    if (field === "name") {
      focusField(subjectId, "credits");
      return;
    }
    if (field === "credits") {
      focusField(subjectId, "gpa");
      return;
    }
    if (field === "gpa") {
      const next = subjects[index + 1];
      if (next) {
        focusField(next.id, "gpa");
      }
    }
  }

  function clearFieldError(id, field) {
    setFieldError((prev) =>
      prev?.id === id && prev?.field === field ? null : prev
    );
  }

  function updateSubject(id, field, value) {
    invalidateResult();
    clearFieldError(id, field);
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === id ? { ...subject, [field]: value } : subject
      )
    );
  }

  function handleGpaChange(id, raw) {
    invalidateResult();
    clearFieldError(id, "gpa");
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === id
          ? { ...subject, gpa: sanitizeGpaInput(raw) }
          : subject
      )
    );
  }

  function handleCreditsChange(id, raw) {
    invalidateResult();
    clearFieldError(id, "credits");
    const digitsOnly = raw.replace(/\D/g, "");
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === id
          ? { ...subject, credits: digitsOnly === "" ? "" : digitsOnly }
          : subject
      )
    );
  }

  function addSubject() {
    invalidateResult();
    setSubjects((prev) => [...prev, createSubject("New Subject", 3)]);
  }

  function removeSubject(id) {
    invalidateResult();
    setSubjects((prev) =>
      prev.length === 1 ? prev : prev.filter((subject) => subject.id !== id)
    );
    setFieldError((prev) => (prev?.id === id ? null : prev));
  }

  function scrollToField(id, field) {
    setTimeout(() => focusField(id, field), 50);
  }

  function handleGenerateSgpa() {
    const invalid = findFirstInvalidField(subjects);

    if (invalid) {
      setFieldError(invalid);
      setGenerateShake(true);
      setTimeout(() => setGenerateShake(false), 500);
      scrollToField(invalid.id, invalid.field);
      return;
    }

    setFieldError(null);

    const { sgpa, totalCredits, contributingCount } = calculateSgpa(subjects);
    const roast = getRoastMessage(sgpa, recentRoastsRef.current);

    recentRoastsRef.current = [roast.text, ...recentRoastsRef.current].slice(
      0,
      12
    );

    setGeneratedResult({ sgpa, totalCredits, contributingCount, roast });
    setResultRevealed(true);

    if (sgpa >= 3.5) {
      fireConfetti();
    }

    setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
  }

  function fieldHasError(id, field) {
    return fieldError?.id === id && fieldError?.field === field;
  }

  return (
    <>
      <CustomCursor />
      <FloatingBackground />

      <div className="app-shell relative z-10 min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden px-4 py-6 sm:py-8">
        <div className="relative mx-auto flex w-full max-w-3xl flex-col justify-center py-2">
          <div className="liquid-glass w-full max-w-full overflow-hidden rounded-[2.5rem] p-5 sm:p-8">
            <header className="relative z-10 mb-8 text-center">
              <div className="liquid-icon-orb mx-auto mb-4">
                <Sparkles className="h-5 w-5 text-violet-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                SGPA Calculator
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
                4th Semester — enter your grades, then generate
              </p>
            </header>

            <div className="relative z-10 mb-3 hidden gap-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-600 md:grid md:grid-cols-[1fr_110px_90px_44px]">
              <span>Subject</span>
              <span>Credit Hours</span>
              <span>GPA</span>
              <span className="sr-only">Remove</span>
            </div>

            <div className="relative z-10 space-y-3">
              {subjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className="liquid-row animate-fadeInUp p-4 md:grid md:grid-cols-[1fr_110px_90px_44px] md:items-start md:gap-3 md:p-3"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative z-10 mb-3 min-w-0 md:mb-0">
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600 md:sr-only">
                      Subject Name
                    </label>
                    <input
                      ref={(el) => setFieldRef(subject.id, "name", el)}
                      type="text"
                      value={subject.name}
                      onChange={(e) =>
                        updateSubject(subject.id, "name", e.target.value)
                      }
                      onFocus={handleInputFocus}
                      onKeyDown={(e) =>
                        handleFieldKeyDown(e, subject.id, "name")
                      }
                      enterKeyHint="next"
                      className={`liquid-input ${
                        fieldHasError(subject.id, "name") ? "liquid-input-error" : ""
                      }`}
                      placeholder="Subject name"
                    />
                    {fieldHasError(subject.id, "name") && (
                      <p className="field-error-msg">{fieldError.message}</p>
                    )}
                  </div>

                  <div className="relative z-10 mb-3 grid min-w-0 grid-cols-2 gap-3 md:mb-0 md:contents">
                    <div className="min-w-0">
                      <label className="mb-1.5 block text-xs font-semibold text-slate-600 md:sr-only">
                        Credit Hours
                      </label>
                      <input
                        ref={(el) => setFieldRef(subject.id, "credits", el)}
                        type="text"
                        inputMode="numeric"
                        value={subject.credits}
                        onChange={(e) =>
                          handleCreditsChange(subject.id, e.target.value)
                        }
                        onFocus={handleInputFocus}
                        onKeyDown={(e) =>
                          handleFieldKeyDown(e, subject.id, "credits")
                        }
                        enterKeyHint="next"
                        className={`liquid-input text-center ${
                          fieldHasError(subject.id, "credits")
                            ? "liquid-input-error"
                            : ""
                        }`}
                        placeholder="Hrs"
                        aria-label="Credit hours"
                      />
                      {fieldHasError(subject.id, "credits") && (
                        <p className="field-error-msg">{fieldError.message}</p>
                      )}
                    </div>

                    <div className="min-w-0">
                      <label className="mb-1.5 block text-xs font-semibold text-slate-600 md:sr-only">
                        GPA
                      </label>
                      <input
                        ref={(el) => setFieldRef(subject.id, "gpa", el)}
                        type="text"
                        inputMode="decimal"
                        value={subject.gpa}
                        onChange={(e) =>
                          handleGpaChange(subject.id, e.target.value)
                        }
                        onFocus={handleInputFocus}
                        onKeyDown={(e) =>
                          handleFieldKeyDown(e, subject.id, "gpa")
                        }
                        enterKeyHint={
                          index < subjects.length - 1 ? "next" : "done"
                        }
                        className={`liquid-input text-center ${
                          fieldHasError(subject.id, "gpa")
                            ? "liquid-input-error"
                            : ""
                        }`}
                        placeholder="0 – 4"
                        aria-label="GPA"
                      />
                      {fieldHasError(subject.id, "gpa") && (
                        <p className="field-error-msg">{fieldError.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="relative z-10 flex justify-end md:justify-center md:pt-1">
                    <button
                      type="button"
                      onClick={() => removeSubject(subject.id)}
                      disabled={subjects.length === 1}
                      className="liquid-pill-btn p-2.5 text-slate-500 transition hover:scale-105 hover:text-red-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Remove subject"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 mt-5 flex items-stretch gap-2.5">
              <button
                type="button"
                onClick={handleGenerateSgpa}
                data-cursor-hover
                className={`liquid-pill-btn liquid-pill-btn-primary group relative flex flex-1 items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold active:scale-[0.98] ${
                  generateShake ? "animate-shake" : ""
                }`}
              >
                <Sparkles className="relative h-4 w-4" />
                <span className="relative">Generate SGPA</span>
              </button>

              <button
                type="button"
                onClick={addSubject}
                data-cursor-hover
                className="liquid-pill-btn flex shrink-0 items-center justify-center gap-1.5 px-4 py-3.5 text-sm font-semibold text-slate-700 hover:scale-105 active:scale-95"
                aria-label="Add subject"
              >
                <Plus className="h-4 w-4" />
                <span className="whitespace-nowrap">Add Subject</span>
              </button>
            </div>

            <div
              ref={resultRef}
              className={`liquid-result relative z-10 mt-8 scroll-mt-8 overflow-hidden p-6 text-center transition-all duration-700 ${
                resultRevealed && generatedResult ? "animate-glowPulse" : ""
              }`}
            >
              <p className="relative text-sm font-bold uppercase tracking-widest text-slate-600">
                Your SGPA
              </p>
              <p
                key={generatedResult?.sgpa ?? "empty"}
                className={`relative mt-2 text-4xl font-bold tracking-tight text-violet-700 sm:text-5xl ${
                  resultRevealed && generatedResult ? "animate-resultPop" : ""
                }`}
              >
                {generatedResult ? generatedResult.sgpa.toFixed(2) : "—"}
              </p>

              {generatedResult && (
                <p
                  className={`roast-msg roast-msg-${generatedResult.roast.tone} relative mt-4`}
                >
                  {generatedResult.roast.text}
                </p>
              )}

              {generatedResult ? (
                <p className="relative mt-3 text-sm font-medium text-slate-600">
                  Based on {generatedResult.contributingCount} subject
                  {generatedResult.contributingCount !== 1 ? "s" : ""} ·{" "}
                  {generatedResult.totalCredits} total credit hours
                </p>
              ) : (
                <p className="relative mt-2 text-sm text-slate-500">
                  Fill in all fields above, then tap Generate SGPA
                </p>
              )}
            </div>

            <footer className="creator-credit relative z-10 mt-8">
              <div className="creator-credit-inner">
                <div className="creator-avatar" aria-hidden="true">
                  SS
                </div>
                <div className="creator-info">
                  <p className="creator-label">Designed &amp; Developed by</p>
                  <p className="creator-name">
                    Shahzaib Saleem
                    <Heart className="creator-heart" aria-hidden="true" />
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
