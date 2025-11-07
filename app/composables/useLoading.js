export const useLoading = () => {
  const loadingState = useState("global_loading", () => false);
  const setLoading = (isLoading) => {
    loadingState.value = isLoading;
  };

  return {
    loadingState,
    setLoading,
  };
};
