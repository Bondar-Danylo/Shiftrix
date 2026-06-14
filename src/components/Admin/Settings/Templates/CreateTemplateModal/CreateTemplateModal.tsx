// Imports
import { useState, useEffect } from "react";

// Styles
import styles from "./CreateTemplateModal.module.scss";

// Components
import Button from "@/components/Common/Button/Button";

// Icons
import CloseIcon from "@/assets/icons/reject_icon.svg?react";

// Types
import type { CreateTemplateModalProps } from "./CreateTemplateModal.types";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CreateTemplateModal = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}: CreateTemplateModalProps) => {
  const isEditMode = !!initialData;

  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [required, setRequired] = useState(2);
  const [minimum, setMinimum] = useState(1);
  const [maximum, setMaximum] = useState(4);
  const [enablePoints, setEnablePoints] = useState(false);
  const [isHighPriority, setIsHighPriority] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (initialData) {
        setTitle(initialData.title);
        setRole(initialData.role);
        setDescription(initialData.description || "");
        setStartTime(initialData.startTime);
        setEndTime(initialData.endTime);
        setRequired(initialData.requiredEmployees);
        setMinimum(initialData.minEmployees);
        setMaximum(initialData.maxEmployees);
        setEnablePoints(initialData.points > 0);
        setIsHighPriority(!!initialData.isHighPriority);

        if (initialData.days === "Everyday") {
          setSelectedDays(DAYS_OF_WEEK);
        } else if (initialData.days.includes("–")) {
          const [start, end] = initialData.days.split("–");
          const startIndex = DAYS_OF_WEEK.indexOf(start);
          const endIndex = DAYS_OF_WEEK.indexOf(end);
          setSelectedDays(DAYS_OF_WEEK.slice(startIndex, endIndex + 1));
        } else {
          setSelectedDays(
            initialData.days
              .split(", ")
              .filter((day) => DAYS_OF_WEEK.includes(day)),
          );
        }
      } else {
        setTitle("");
        setRole("");
        setDescription("");
        setStartTime("");
        setEndTime("");
        setSelectedDays([]);
        setIsRecurring(false);
        setRequired(2);
        setMinimum(1);
        setMaximum(4);
        setEnablePoints(false);
        setIsHighPriority(false);
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const formatDaysString = (days: string[]): string => {
    if (days.length === 0) return "Not specified";
    if (days.length === 7) return "Everyday";
    const indexes = days
      .map((d) => DAYS_OF_WEEK.indexOf(d))
      .sort((a, b) => a - b);
    const isSequential = indexes.every(
      (val, i) => i === 0 || val === indexes[i - 1] + 1,
    );

    if (isSequential && days.length > 2) {
      const sortedDays = [...days].sort(
        (a, b) => DAYS_OF_WEEK.indexOf(a) - DAYS_OF_WEEK.indexOf(b),
      );
      return `${sortedDays[0]}–${sortedDays[sortedDays.length - 1]}`;
    }
    return days.join(", ");
  };

  const executeSubmit = () => {
    if (!title || !role || !startTime || !endTime) {
      alert("Please fill in all required fields (*)");
      return;
    }

    onSave({
      title,
      role,
      location: initialData?.location || "Downtown",
      startTime,
      endTime,
      requiredEmployees: Number(required),
      minEmployees: Number(minimum),
      maxEmployees: Number(maximum),
      points: enablePoints ? initialData?.points || 15 : 0,
      days: formatDaysString(selectedDays),
      description,
      isHighPriority,
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.header__title}>
            {isEditMode ? "Edit Shift Template" : "Create Shift Template"}
          </h2>
          <button
            type="button"
            className={styles.header__close}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.formContent}>
          <div className={styles.section}>
            <h3 className={styles.section__title}>Basic Information</h3>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Shift Name *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Morning Shift"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Role *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Server"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description (Optional)</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Busy evening service"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.section__title}>Time</h3>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Start Time *</label>
                <input
                  type="time"
                  className={styles.input}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>End Time *</label>
                <input
                  type="time"
                  className={styles.input}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.section__title}>Recurrence</h3>
            <label className={styles.label}>Select Days *</label>
            <div className={styles.daysGrid}>
              {DAYS_OF_WEEK.map((day) => {
                const isActive = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    className={`${styles.dayButton} ${isActive ? styles.dayButton_active : ""}`}
                    onClick={() => handleDayToggle(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              <span>Recurring weekly</span>
            </label>
          </div>

          <div className={styles.section}>
            <h3 className={styles.section__title}>Staffing Requirements</h3>
            <div className={styles.tripleRow}>
              <div className={styles.field}>
                <label className={styles.label}>Required *</label>
                <input
                  type="number"
                  className={styles.input}
                  value={required}
                  onChange={(e) => setRequired(Number(e.target.value))}
                  min={1}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Minimum</label>
                <input
                  type="number"
                  className={styles.input}
                  value={minimum}
                  onChange={(e) => setMinimum(Number(e.target.value))}
                  min={1}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Maximum</label>
                <input
                  type="number"
                  className={styles.input}
                  value={maximum}
                  onChange={(e) => setMaximum(Number(e.target.value))}
                  min={1}
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.section__title}>System Settings</h3>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={enablePoints}
                onChange={(e) => setEnablePoints(e.target.checked)}
              />
              <span>Enable reward points</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isHighPriority}
                onChange={(e) => setIsHighPriority(e.target.checked)}
              />
              <span>High priority shift (must be filled)</span>
            </label>
          </div>
          <div className={styles.section}>
            <h3 className={styles.section__title}>Instructions</h3>
            <textarea
              className={styles.textarea}
              placeholder="Special instructions or notes for employees..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            isLink={false}
            size="normal"
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            isLink={false}
            size="normal"
            type="button"
            className={styles.submitBtn}
            onClick={executeSubmit}
          >
            {isEditMode ? "Save Changes" : "Create Template"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal;
