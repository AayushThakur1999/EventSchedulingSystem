import { useNavigation } from "react-router-dom";

const SubmitBtn = ({ text }: { text: string }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <button
      type="submit"
      className={`btn btn-primary btn-block capitalize transition-all text-base font-semibold ${
        isSubmitting ? "cursor-not-allowed opacity-75" : "hover:scale-105"
      }`}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <span className="loading loading-ring loading-md"></span>
          Logging-in...
        </>
      ) : (
        text || "Submit"
      )}
    </button>
  );
};
export default SubmitBtn;