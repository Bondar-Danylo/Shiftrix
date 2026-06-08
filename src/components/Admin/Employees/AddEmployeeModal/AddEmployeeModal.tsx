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

// Imports
import React, { useState, useEffect, useRef } from "react";

const STATUS_OPTIONS: StatusOption[] = [
  { id: "Available", name: "Available" },
  { id: "Working", name: "Working" },
  { id: "Vacation", name: "Vacation" },
  { id: "Sick Leave", name: "Sick Leave" },
  { id: "Day Off", name: "Day Off" },
];

const INITIAL_STATE: FormState = {
  name: "",
  role: "",
  email: "",
  phone: "",
  selectedStatus: STATUS_OPTIONS[0],
  maxHours: 40,
  initialPoints: 0,
  whatsappConnected: false,
  avatarUrl: "",
};

const AddEmployeeModal = ({
  isOpen,
  onClose,
  onAdd,
  employeeToEdit,
}: AddEmployeeModalProps) => {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = Boolean(employeeToEdit);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (employeeToEdit) {
        const currentStatus =
          STATUS_OPTIONS.find((opt) => opt.id === employeeToEdit.status) ||
          STATUS_OPTIONS[0];

        setForm({
          name: employeeToEdit.name || "",
          role: employeeToEdit.role || "",
          email: employeeToEdit.email || "",
          phone: employeeToEdit.phone || "",
          selectedStatus: currentStatus,
          maxHours: employeeToEdit.maxHours ?? 40,
          initialPoints: employeeToEdit.points ?? 0,
          whatsappConnected: employeeToEdit.whatsappConnected || false,
          avatarUrl: employeeToEdit.avatarUrl || "",
        });
      } else {
        setForm(INITIAL_STATE);
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, employeeToEdit]);

  if (!isOpen) return null;

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
      setAvatarFile(file);
      setForm((prev) => ({ ...prev, avatarUrl: URL.createObjectURL(file) }));
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setForm(INITIAL_STATE);
    setAvatarFile(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.role.trim()) {
      alert("Please fill in Name and Role");
      return;
    }

    onAdd({
      ...(employeeToEdit && { id: employeeToEdit.id }),
      name: form.name,
      role: form.role,
      email: form.email.trim(),
      phone: form.phone.trim(),
      status: form.selectedStatus.id,
      maxHours: form.maxHours,
      points: form.initialPoints,
      whatsappConnected: form.whatsappConnected,
      avatarUrl:
        form.avatarUrl ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(form.name)}`,
    });

    handleReset();
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
              ? "Update the employee information and account settings below"
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
                <label className={styles.label}>Role / Position *</label>
                <input
                  type="text"
                  name="role"
                  className={styles.input}
                  placeholder="e.g. Chef, Waiter"
                  value={form.role}
                  onChange={handleInputChange}
                  required
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
                  max={168}
                  value={form.maxHours}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={styles.row}>
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
              <div className={styles.inputGroup} />
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
            >
              {isEditMode ? "Save Changes" : "Add Employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
