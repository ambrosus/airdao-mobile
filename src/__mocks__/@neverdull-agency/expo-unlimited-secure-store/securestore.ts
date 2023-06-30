const createSecureStore = jest.fn(() => {
  return {
    setItem: jest.fn().mockResolvedValue(null)
  };
});

export default createSecureStore;
