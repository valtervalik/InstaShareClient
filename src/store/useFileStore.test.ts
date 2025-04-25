import { useFileStore } from './useFileStore';

describe('useFileStore', () => {
  it('should have initial state', () => {
    const state = useFileStore.getState();
    expect(state.file).toEqual({
      _id: '',
      filename: '',
      ref: '',
      size: 0,
      compressedSize: 0,
    });
    expect(state.jobId).toBeNull();
  });

  it('should set file correctly', () => {
    const file = {
      _id: '1',
      filename: 'test.txt',
      ref: 'abc',
      size: 123,
      compressedSize: 100,
    };
    useFileStore.getState().setFile(file);
    expect(useFileStore.getState().file).toEqual(file);
  });

  it('should set jobId correctly', () => {
    useFileStore.getState().setJobId('job-123');
    expect(useFileStore.getState().jobId).toBe('job-123');
  });
});
