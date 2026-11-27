import asyncHandler from '../../utils/asyncHandler.js';

describe('asyncHandler', () => {
  it('should call next with error when async function throws', async () => {
    const error = new Error('Test error');
    const mockFn = asyncHandler(async () => { throw error; });
    const next = jest.fn();

    await mockFn({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should execute the handler when no error', async () => {
    const mockRes = { json: jest.fn() };
    const mockFn = asyncHandler(async (req, res) => {
      res.json({ success: true });
    });
    const next = jest.fn();

    await mockFn({}, mockRes, next);

    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    expect(next).not.toHaveBeenCalled();
  });
});