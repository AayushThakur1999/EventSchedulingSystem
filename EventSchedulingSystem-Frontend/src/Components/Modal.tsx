const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-1/4 absolute bg-white p-6 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 text-lg top-2 text-secondary"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
