import { Modal } from "../../../components/shared/Modal";

interface DeleteProjectDialogProps {
    projectName: string | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteProjectDialog = ({ projectName, isOpen, onClose, onConfirm }: DeleteProjectDialogProps) => (
    <Modal title="Delete Project" isOpen={isOpen} onClose={onClose}>
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-200">
            <p>
                Delete <span className="font-semibold text-slate-900 dark:text-white">{projectName}</span>? This action cannot be undone.
            </p>
            <div className="flex flex-wrap justify-end gap-3">
                <button
                    type="button"
                    className="rounded-full border border-slate-300 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200"
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-red-600 hover:border-red-400/60 dark:text-red-200"
                    onClick={onConfirm}
                >
                    Delete
                </button>
            </div>
        </div>
    </Modal>
);

export type { DeleteProjectDialogProps };
