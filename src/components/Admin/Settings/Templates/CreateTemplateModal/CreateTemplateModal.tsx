// Imports
import { useState, useEffect } from "react";

// Styles
import styles from "./CreateTemplateModal.module.scss";

// Components
import Button from "@/components/Common/Button/Button";
import Dropdown from "@/components/Common/Dropdown/Dropdown";

// Icons
import CloseIcon from "@/assets/icons/reject_icon.svg?react";

// Types
import type { CreateTemplateModalProps } from "./CreateTemplateModal.types";

// Extras
const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
interface RoleOption {
  id: string | number;
  name: string;
}

const CreateTemplateModal = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}: CreateTemplateModalProps) => {
  const isEditMode = !!initialData;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [required, setRequired] = useState(2);
  const [minimum, setMinimum] = useState(1);
  const [maximum, setMaximum] = useState(4);
  const [enablePoints, setEnablePoints] = useState(false);
  const [isHighPriority, setIsHighPriority] = useState(false);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [isRolesLoading, setIsRolesLoading] = useState(false);

  useEffect((): void => {
    const fetchRoles = async (): Promise<void> => {
      try {
        setIsRolesLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/get_options.php`,
        );
        if (!response.ok) throw new Error("Failed to load professions");

        const data = await response.json();

        const positionsArray =
          data && Array.isArray(data.positions) ? data.positions : [];

        const formattedRoles = positionsArray.map((item: any) => ({
          id: item.id,
          name:
            item.name ||
            item.title ||
            item.position_name ||
            item.profession_name,
        }));

        setRoles(formattedRoles);

        if (initialData) {
          const currentRole = formattedRoles.find(
            (r: RoleOption) =>
              r.name.toLowerCase() === initialData.role.toLowerCase(),
          );
          if (currentRole) setSelectedRole(currentRole);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsRolesLoading(false);
      }
    };

    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description || "");
        setInstructions(initialData.instructions || "");
        setStartTime(initialData.startTime);
        setEndTime(initialData.endTime);
        setRequired(initialData.requiredEmployees);
        setMinimum(initialData.minEmployees);
        setMaximum(initialData.maxEmployees);
        setEnablePoints(initialData.points > 0);
        setIsHighPriority(!!initialData.isHighPriority);
        setIsRecurring(!!initialData.isRecurring);
        setSelectedDays(
          Array.isArray(initialData.days) ? initialData.days : [],
        );
      } else {
        setTitle("");
        setSelectedRole(null);
        setDescription("");
        setInstructions("");
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

  const handleDayToggle = (day: string): void => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const executeSubmit = (): void => {
    if (!title || !selectedRole || !startTime || !endTime) {
      alert("Please fill in all required fields (*)");
      return;
    }

    if (selectedDays.length === 0) {
      alert("Please select at least one day for the shift");
      return;
    }

    onSave({
      title,
      role: selectedRole.name,
      location: initialData?.location || "Downtown",
      startTime,
      endTime,
      requiredEmployees: Number(required),
      minEmployees: Number(minimum),
      maxEmployees: Number(maximum),
      points: enablePoints ? initialData?.points || 15 : 0,
      days: selectedDays,
      description,
      instructions,
      isHighPriority,
      isRecurring,
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
                <Dropdown<RoleOption>
                  options={roles}
                  value={selectedRole}
                  onSelect={(option) => setSelectedRole(option)}
                  getOptionLabel={(option) => option.name}
                  renderOption={(option) => <span>{option.name}</span>}
                  placeholder={
                    isRolesLoading ? "Loading roles..." : "Select role..."
                  }
                  className={styles.dropdownWidth}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Description (For Managers)</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Internal notes or shift description..."
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
            <h3 className={styles.section__title}>
              Instructions (For Employees)
            </h3>
            <textarea
              className={styles.textarea}
              placeholder="Special instructions or notes that employees will see..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
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
