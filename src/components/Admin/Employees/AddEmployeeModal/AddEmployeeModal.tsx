// Imports
import React, { useState, useEffect, useRef } from "react";

// Styles
import styles from "./AddEmployeeModal.module.scss";

// Icons
import CloseIcon from "@/assets/icons/reject_icon.svg?react";
import UploadIcon from "@/assets/icons/download_icon.svg?react";

// Components
import Button from "@/components/Common/Button/Button";
import Dropdown from "@/components/Common/Dropdown/Dropdown";

// Types
import type {
  AddEmployeeModalProps,
  FormState,
  StatusOption,
} from "./AddEmployeeModal.types";

const STATUS_OPTIONS: StatusOption[] = [
  { id: "Available", name: "Available" },
  { id: "Working", name: "Working" },
  { id: "Vacation", name: "Vacation" },
  { id: "Sick Leave", name: "Sick Leave" },
  { id: "Day Off", name: "Day Off" },
];

const INITIAL_STATE: FormState = {
  name: "",
  role: "employee",
  email: "",
  phone: "",
  selectedStatus: STATUS_OPTIONS[0],
  maxHours: 40,
  initialPoints: 0,
  whatsappConnected: false,
  avatarUrl: "",
  selectedDepartment: null,
  selectedPosition: null,
};

const AddEmployeeModal = ({
  isOpen,
  onClose,
  onAdd,
  employeeToEdit,
}: AddEmployeeModalProps) => {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = Boolean(employeeToEdit);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (employeeToEdit) {
        setForm({
          name: employeeToEdit.name || "",
          role: employeeToEdit.role || "employee",
          email: employeeToEdit.email || "",
          phone: employeeToEdit.phone || "",

          selectedStatus:
            STATUS_OPTIONS.find(
              (opt) =>
                opt.id.toLowerCase() === employeeToEdit.status?.toLowerCase(),
            ) || STATUS_OPTIONS[0],
          maxHours: employeeToEdit.max_hours ?? 40,
          initialPoints: employeeToEdit.points_balance ?? 0,
          whatsappConnected: employeeToEdit.is_bot_connected || false,
          avatarUrl: employeeToEdit.photo_url
            ? employeeToEdit.photo_url.includes("http")
              ? employeeToEdit.photo_url
              : `${import.meta.env.VITE_API_MAIN}/${employeeToEdit.photo_url}`
            : `https://api.dicebear.com/10.x/avataaars/png?seed=${employeeToEdit.id}`,
          selectedDepartment: null,
          selectedPosition: null,
        });
      } else {
        setForm(INITIAL_STATE);
      }

      fetch(`${import.meta.env.VITE_API_URL}/get_options.php`)
        .then((res) => res.json())
        .then((data) => {
          const fetchedDepartments = data.departments || [];
          const fetchedPositions = data.positions || [];

          setDepartments(fetchedDepartments);
          setPositions(fetchedPositions);

          if (employeeToEdit) {
            setForm((prev) => ({
              ...prev,
              selectedDepartment:
                fetchedDepartments.find(
                  (d: any) =>
                    String(d.id) === String(employeeToEdit.department_id),
                ) || null,
              selectedPosition:
                fetchedPositions.find(
                  (p: any) =>
                    String(p.id) === String(employeeToEdit.position_id),
                ) || null,
            }));
          }
        })
        .catch((err) => console.error("Error", err));
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, employeeToEdit]);

  if (!isOpen) return null;

  // Handles
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleStatusSelect = (opt: StatusOption) => {
    setForm((prev) => ({ ...prev, selectedStatus: opt }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, avatarUrl: URL.createObjectURL(file) }));
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleReset = () => {
    setForm(INITIAL_STATE);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Please fill in Name");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();

    if (isEditMode && employeeToEdit?.id) {
      formData.append("id", String(employeeToEdit.id));
    }

    formData.append("name", form.name);
    formData.append("role", "employee");
    formData.append("email", form.email.trim());
    formData.append("phone", form.phone.trim());
    formData.append("status", form.selectedStatus.id.toLowerCase());
    formData.append("maxHours", String(form.maxHours));
    formData.append("initialPoints", String(form.initialPoints));
    formData.append("whatsappConnected", form.whatsappConnected ? "1" : "0");
    formData.append(
      "department_id",
      form.selectedDepartment ? String(form.selectedDepartment.id) : "0",
    );
    formData.append(
      "position_id",
      form.selectedPosition ? String(form.selectedPosition.id) : "0",
    );

    const file = fileInputRef.current?.files?.[0];
    if (file) formData.append("photo", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/save_employee.php`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();
      if (result.success) {
        if (result.success) {
          onAdd({
            id: employeeToEdit?.id,
            name: form.name,
            role: form.role,
            email: form.email,
            phone: form.phone,
            status: form.selectedStatus.id as
              | "Working"
              | "Vacation"
              | "Sick Leave"
              | "Available"
              | "Day Off",
            initialPoints: form.initialPoints,
            points_balance: form.initialPoints,
            max_hours: form.maxHours,
            is_bot_connected: form.whatsappConnected,
            photo_url: result.path || form.avatarUrl,
            position_id: form.selectedPosition
              ? Number(form.selectedPosition.id)
              : 0,
            department_id: form.selectedDepartment
              ? Number(form.selectedDepartment.id)
              : 0,
          });
          handleReset();
        }
        handleReset();
      } else {
        alert("Error: " + (result.error || "Unknown"));
      }
    } catch (err) {
      alert("Server connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleReset}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={handleReset}>
          <CloseIcon />
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEditMode ? "Edit Employee Profile" : "Add New Employee"}
          </h2>
          <p className={styles.subtitle}>
            {isEditMode
              ? "Update the employee information below"
              : "Fill in the information below to add a new team member"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.content}>
            <div className={styles.avatarSection}>
              <div
                className={styles.avatarPreviewContainer}
                onClick={triggerFileSelect}
              >
                {form.avatarUrl ? (
                  <img
                    src={form.avatarUrl}
                    alt="Preview"
                    className={styles.avatarPreview}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <UploadIcon className={styles.uploadIcon} />
                    <span>Upload</span>
                  </div>
                )}
              </div>
              <div className={styles.avatarInfo}>
                <button
                  type="button"
                  className={styles.uploadBtn}
                  onClick={triggerFileSelect}
                >
                  Choose Photo
                </button>
                <p className={styles.uploadHint}>JPG or PNG. Max size of 2MB</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className={styles.hiddenFileInput}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Department</label>
                <Dropdown
                  options={departments}
                  value={form.selectedDepartment}
                  renderOption={(o: any) => <span>{o.name}</span>}
                  onSelect={(opt) =>
                    setForm((p) => ({ ...p, selectedDepartment: opt }))
                  }
                  getOptionLabel={(o: any) => o.name}
                  className={styles.customDropdown}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Position</label>
                <Dropdown
                  options={positions}
                  value={form.selectedPosition}
                  renderOption={(o: any) => <span>{o.name}</span>}
                  onSelect={(opt) =>
                    setForm((p) => ({ ...p, selectedPosition: opt }))
                  }
                  getOptionLabel={(o: any) => o.name}
                  className={styles.customDropdown}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className={styles.input}
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  {isEditMode ? "Current Points" : "Initial Points"}
                </label>
                <input
                  type="number"
                  name="initialPoints"
                  className={styles.input}
                  min={0}
                  value={form.initialPoints}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  className={styles.input}
                  placeholder="john.doe@example.com"
                  value={form.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className={styles.input}
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Initial Status</label>
                <Dropdown
                  options={STATUS_OPTIONS}
                  value={form.selectedStatus}
                  onSelect={handleStatusSelect}
                  getOptionLabel={(opt) => opt.name}
                  renderOption={(opt) => <span>{opt.name}</span>}
                  className={styles.customDropdown}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Weekly Max Hours</label>
                <input
                  type="number"
                  name="maxHours"
                  className={styles.input}
                  min={1}
                  max={56}
                  value={form.maxHours}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="whatsappConnected"
                  className={styles.checkbox}
                  checked={form.whatsappConnected}
                  onChange={handleInputChange}
                />
                <span>Send WhatsApp Bot invite</span>
              </label>
            </div>
          </div>

          <div className={styles.footer}>
            <Button
              isLink={false}
              type="button"
              size="normal"
              className={styles.cancelBtn}
              onClick={handleReset}
            >
              Cancel
            </Button>
            <Button
              isLink={false}
              type="submit"
              size="normal"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
