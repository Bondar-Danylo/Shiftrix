// Imports
import { useState } from "react";

// Styles
import styles from "./Templates.module.scss";

// Components
import Button from "@/components/Common/Button/Button";
import Search from "@/components/Common/Search/Search";
import TemplatesList from "../TemplatesList/TemplatesList";
import ConfirmationModal from "@/components/Common/ConfirmationModal/ConfirmationModal";
import CreateTemplateModal from "../CreateTemplateModal/CreateTemplateModal";

// Types
import type { ShiftTemplate } from "./Templates.types";
type ModalMode = "delete" | "duplicate";

const INITIAL_MOCK_TEMPLATES: ShiftTemplate[] = [
  {
    id: "1",
    title: "Morning Shift",
    role: "Server",
    location: "Downtown",
    startTime: "09:00",
    endTime: "17:00",
    requiredEmployees: 3,
    minEmployees: 2,
    maxEmployees: 4,
    points: 10,
    days: "Mon–Fri",
    description: "Standard morning service",
  },
  {
    id: "2",
    title: "Evening Shift",
    role: "Server",
    location: "Downtown",
    startTime: "17:00",
    endTime: "23:00",
    requiredEmployees: 4,
    minEmployees: 3,
    maxEmployees: 5,
    points: 15,
    days: "Fri, Sat",
    description: "Busy evening service, high energy required",
    isHighPriority: true,
  },
];

const Templates = () => {
  const [templates, setTemplates] = useState<ShiftTemplate[]>(
    INITIAL_MOCK_TEMPLATES,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<ShiftTemplate | null>(
    null,
  );
  const [activeTemplate, setActiveTemplate] = useState<ShiftTemplate | null>(
    null,
  );
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateClick = (): void => {
    setTemplateToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (template: ShiftTemplate): void => {
    setTemplateToEdit(template);
    setIsFormModalOpen(true);
  };

  const handleSaveTemplate = (
    templateData: Omit<ShiftTemplate, "id">,
  ): void => {
    if (templateToEdit) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === templateToEdit.id
            ? { ...templateData, id: templateToEdit.id }
            : t,
        ),
      );
    } else {
      const freshTemplate: ShiftTemplate = {
        ...templateData,
        id: crypto.randomUUID(),
      };
      setTemplates((prev) => [freshTemplate, ...prev]);
    }
    setIsFormModalOpen(false);
    setTemplateToEdit(null);
  };

  const handleDeleteClick = (template: ShiftTemplate): void => {
    setActiveTemplate(template);
    setModalMode("delete");
  };

  const handleDuplicateClick = (template: ShiftTemplate): void => {
    setActiveTemplate(template);
    setModalMode("duplicate");
  };

  const handleCloseModal = (): void => {
    setActiveTemplate(null);
    setModalMode(null);
  };

  const handleConfirmAction = async (): Promise<void> => {
    if (!activeTemplate || !modalMode) return;
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (modalMode === "delete") {
        setTemplates((prev) => prev.filter((t) => t.id !== activeTemplate.id));
      } else if (modalMode === "duplicate") {
        const newTemplate: ShiftTemplate = {
          ...activeTemplate,
          id: crypto.randomUUID(),
          title: `${activeTemplate.title} (Copy)`,
        };
        setTemplates((prev) => {
          const index = prev.findIndex((t) => t.id === activeTemplate.id);
          const updated = [...prev];
          updated.splice(index + 1, 0, newTemplate);
          return updated;
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.header__title}>Shift Templates</h2>
          <p className={styles.header__subtitle}>
            Create reusable templates for recurring shifts
          </p>
        </div>
        <Button
          type="button"
          size="normal"
          isLink={false}
          className={styles.btn}
          onClick={handleCreateClick}
        >
          <span>Create Template</span>
        </Button>
      </div>

      <Search
        placeholder="Search templates..."
        onChangeDebounced={(value) => setSearchQuery(value)}
        className={styles.search}
      />

      <TemplatesList
        templates={filteredTemplates}
        searchQuery={searchQuery}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onDuplicateClick={handleDuplicateClick}
      />

      <CreateTemplateModal
        isOpen={isFormModalOpen}
        initialData={templateToEdit}
        onClose={() => {
          setIsFormModalOpen(false);
          setTemplateToEdit(null);
        }}
        onSave={handleSaveTemplate}
      />

      <ConfirmationModal
        isOpen={modalMode !== null}
        title={
          modalMode === "delete" ? "Delete Template" : "Duplicate Template"
        }
        description={`Are you sure action for "${activeTemplate?.title}"?`}
        confirmText={modalMode === "delete" ? "Delete" : "Duplicate"}
        cancelText="Cancel"
        variant={modalMode === "delete" ? "danger" : "primary"}
        isLoading={isProcessing}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default Templates;
