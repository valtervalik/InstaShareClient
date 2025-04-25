import { FileCategory } from '@/interfaces/explorer/file-category/file-category.interface';
import { useFileCategoryStore } from './useFileCategoryStore';

describe('useFileCategoryStore', () => {
  it('should have initial state', () => {
    const state = useFileCategoryStore.getState();
    expect(state.fileCategory).toBeNull();
  });

  it('should set fileCategory correctly', () => {
    const fileCategory: FileCategory = { _id: '1', name: 'category1' };
    useFileCategoryStore.getState().setFileCategory(fileCategory);
    expect(useFileCategoryStore.getState().fileCategory).toEqual(fileCategory);
  });
});
