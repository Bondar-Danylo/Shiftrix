// Imports
import { useState, useEffect, useCallback } from "react";

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

const API_URL: string = `${import.meta.env.VITE_API_URL}/shift_templates.php`;

const Templates = () => {
  const [templates, setTemplates] = useState<ShiftTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchTemplates = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading templates:", error);
      alert("Could not load templates from server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect((): void => {
    fetchTemplates();
  }, [fetchTemplates]);

  const filteredTemplates: ShiftTemplate[] = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handles
  const handleCreateClick = (): void => {
    setTemplateToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (template: ShiftTemplate): void => {
    setTemplateToEdit(template);
    setIsFormModalOpen(true);
  };

  const handleSaveTemplate = async (
    templateData: Omit<ShiftTemplate, "id">,
  ): Promise<void> => {
    try {
      const payload = templateToEdit
        ? { id: templateToEdit.id, ...templateData }
        : { ...templateData };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTemplates();
        setIsFormModalOpen(false);
        setTemplateToEdit(null);
      } else {
        alert("Server error: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Failed to connect to the server.");
    }
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
      if (modalMode === "delete") {
        const response = await fetch(`${API_URL}?id=${activeTemplate.id}`, {
          method: "DELETE",
        });
        const result = await response.json();

        if (result.success) {
          setTemplates((prev) =>
            prev.filter((t) => t.id !== activeTemplate.id),
          );
        } else {
          alert("Delete error: " + result.error);
        }
      } else if (modalMode === "duplicate") {
        const duplicateData: Omit<ShiftTemplate, "id"> = {
          title: `${activeTemplate.title} (Copy)`,
          role: activeTemplate.role,
          location: activeTemplate.location,
          startTime: activeTemplate.startTime,
          endTime: activeTemplate.endTime,
          requiredEmployees: activeTemplate.requiredEmployees,
          minEmployees: activeTemplate.minEmployees,
          maxEmployees: activeTemplate.maxEmployees,
          points: activeTemplate.points,
          days: activeTemplate.days,
          description: activeTemplate.description,
          instructions: activeTemplate.instructions,
          isHighPriority: activeTemplate.isHighPriority,
          isRecurring: activeTemplate.isRecurring,
        };

        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(duplicateData),
        });
        const result = await response.json();

        if (result.success) {
          await fetchTemplates();
        } else {
          alert("Duplicate error: " + result.error);
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error(`Error processing ${modalMode}:`, error);
      alert("Connection to server failed.");
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

      {isLoading ? (
        <div className={styles.loading}>Loading templates...</div>
      ) : (
        <TemplatesList
          templates={filteredTemplates}
          searchQuery={searchQuery}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onDuplicateClick={handleDuplicateClick}
        />
      )}

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
        description={`Are you sure you want to ${modalMode === "delete" ? "delete" : "duplicate"} "${activeTemplate?.title}"?`}
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
